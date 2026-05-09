<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\Clinic;
use App\Models\UnitOfMeasure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MedicinesController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user || $user->is_admin) {
                $clinic_id = $request->clinic_id;
            } else {
                $clinic_id = $user->clinic_id;
            }

            $query = Medicine::with(['clinic', 'unit_of_measure', 'item_type', 'consultation_type'])
                ->withCount(['medicine_dispensations as issued_today' => function ($q) {
                    $q->whereDate('created_at', now()->toDateString());
                }])
                ->medicines()
                ->when($clinic_id, function ($q) use ($clinic_id) {
                    $q->where('clinic_id', $clinic_id);
                })
                ->where('status', 'Active');

            $search = $request->search ?? $request->q;
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            }

            if ($request->has('has_expiry') && $request->has_expiry !== '') {
                $query->where('has_expiry', $request->has_expiry);
            }

            if ($request->has('prescription_required') && $request->prescription_required !== '') {
                $query->where('prescription_required', $request->prescription_required);
            }

            if ($request->has('controlled_substance') && $request->controlled_substance !== '') {
                $query->where('controlled_substance', $request->controlled_substance);
            }

            // Stock status filter
            if ($request->stock_status === 'In Stock') {
                $query->where('balance', '>', 5);
            } elseif ($request->stock_status === 'Low Stock') {
                $query->where('balance', '>', 0)->where('balance', '<=', 5);
            } elseif ($request->stock_status === 'Out of Stock') {
                $query->where('balance', '<=', 0);
            }

            $sortBy = $request->get('sort_by', 'name');
            $sortOrder = $request->get('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            $perPage = (int) $request->get('per_page', 15);
            $medicines = $query->paginate($perPage);

            $medicines->getCollection()->transform(function ($row) {
                $row->balance = isset($row->balance) && $row->balance !== null ? $row->balance : 0;
                $row->new_balance = isset($row->new_balance) && $row->new_balance !== null ? $row->new_balance : 0;
                $row->current_balance = isset($row->current_balance) && $row->current_balance !== null ? $row->current_balance : $row->balance;
                $row->available_balance = isset($row->available_balance) && $row->available_balance !== null ? $row->available_balance : $row->balance;
                return $row;
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'data' => $medicines->items(),
                    'total' => $medicines->total(),
                    'current_page' => $medicines->currentPage(),
                    'per_page' => $medicines->perPage(),
                    'last_page' => $medicines->lastPage(),
                ]
            ]);
        } catch (\Throwable $e) {
            \Log::error('Medicines index failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => true,
                'data' => [
                    'data' => [],
                    'total' => 0,
                    'current_page' => (int) ($request->get('page', 1)),
                    'per_page' => (int) ($request->get('per_page', 15)),
                    'last_page' => 0,
                ]
            ]);
        }
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $clinic_id = $user->clinic_id;

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:100',
            'generic_name' => 'nullable|string|max:255',
            'brand_name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'unit_of_measure_id' => 'required|exists:units_of_measure,id',
            'balance' => 'required|numeric|min:0',
            'unit_buying_price' => 'nullable|numeric|min:0',
            'selling_price' => 'nullable|numeric|min:0',
            'expiry_date' => 'nullable|date|after:today',
            'minimum_stock' => 'required|numeric|min:0',
            'has_expiry' => 'required|in:Yes,No',
            'prescription_required' => 'required|in:Yes,No',
            'controlled_substance' => 'required|in:Yes,No',
            'dosage_instructions' => 'nullable|string',
            'side_effects' => 'nullable|string',
            'contraindications' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            $medicineColumns = Schema::getColumnListing('medicines');

            $attributes = [
                'clinic_id' => $clinic_id,
                'name' => $request->name,
                'code' => $request->code,
                'generic_name' => $request->generic_name,
                'brand_name' => $request->brand_name,
                'description' => $request->description,
                'unit_of_measure_id' => $request->unit_of_measure_id,
                'balance' => $request->balance,
                'new_balance' => $request->balance,
                'unit_buying_price' => $request->unit_buying_price,
                'selling_price' => $request->selling_price,
                'expiry_date' => $request->expiry_date,
                'minimum_stock' => $request->minimum_stock,
                'has_expiry' => $request->has_expiry,
                'prescription_required' => $request->prescription_required,
                'controlled_substance' => $request->controlled_substance,
                'dosage_instructions' => $request->dosage_instructions,
                'side_effects' => $request->side_effects,
                'contraindications' => $request->contraindications,
                'status' => 'Active',
            ];

            $attributes = array_intersect_key($attributes, array_flip($medicineColumns));
            $medicine = Medicine::create($attributes);

            return response()->json([
                'success' => true,
                'message' => 'Medicine created successfully',
                'data' => $medicine->load(['clinic', 'unit_of_measure'])
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating medicine: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($id)
    {
        $user = Auth::user();
        $clinic_id = $user->clinic_id;

        $medicine = Medicine::with(['clinic', 'unit_of_measure'])
            ->where('clinic_id', $clinic_id)
            ->where('id', $id)
            ->first();

        if (!$medicine) {
            return response()->json([
                'success' => false,
                'message' => 'Medicine not found'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $medicine
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $clinic_id = $user->clinic_id;

        $medicine = Medicine::where('clinic_id', $clinic_id)
            ->where('id', $id)
            ->first();

        if (!$medicine) {
            return response()->json([
                'success' => false,
                'message' => 'Medicine not found'
            ], Response::HTTP_NOT_FOUND);
        }

        try {
            $medicineColumns = Schema::getColumnListing('medicines');

            $fields = [
                'name', 'code', 'generic_name', 'brand_name', 'description',
                'unit_of_measure_id', 'balance', 'unit_buying_price', 'selling_price',
                'expiry_date', 'minimum_stock', 'has_expiry', 'prescription_required',
                'controlled_substance', 'dosage_instructions', 'side_effects',
                'contraindications', 'status',
            ];

            $updateData = [];
            foreach ($fields as $field) {
                if ($request->has($field)) {
                    $updateData[$field] = $request->$field;
                }
            }

            $updateData = array_intersect_key($updateData, array_flip($medicineColumns));
            $medicine->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Medicine updated successfully',
                'data' => $medicine->load(['clinic', 'unit_of_measure'])
            ]);

        } catch (\Exception $e) {
            \Log::error('Medicine update failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error updating medicine: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $clinic_id = $user->clinic_id;

        $medicine = Medicine::where('clinic_id', $clinic_id)
            ->where('id', $id)
            ->first();

        if (!$medicine) {
            return response()->json([
                'success' => false,
                'message' => 'Medicine not found'
            ], Response::HTTP_NOT_FOUND);
        }

        try {
            $medicine->update(['status' => 'Inactive']);

            return response()->json([
                'success' => true,
                'message' => 'Medicine deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting medicine: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getForSelection(Request $request)
    {
        $user = Auth::user();
        $clinic_id = $user->clinic_id;

        $query = Medicine::where('clinic_id', $clinic_id)
            ->where('status', 'Active');

        if ($request->get('exclude_expired', false)) {
            $query->where(function ($q) {
                $q->where('has_expiry', 'No')
                  ->orWhere('expiry_date', '>', now());
            });
        }

        if ($request->get('exclude_out_of_stock', false)) {
            $query->where('balance', '>', 0);
        }

        $medicines = $query->select('id', 'name', 'code', 'balance', 'unit_buying_price', 'selling_price')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $medicines
        ]);
    }

    public function bulkCreate(Request $request)
    {
        $user = Auth::user();
        $clinic_id = $user->clinic_id;

        if (!Schema::hasTable('medicines')) {
            return response()->json([
                'success' => false,
                'message' => 'Database is not ready: missing medicines table. Please run migrations on the server.',
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }

        if (!Schema::hasTable('units_of_measure')) {
            return response()->json([
                'success' => false,
                'message' => 'Database is not ready: missing units_of_measure table. Please run migrations on the server.',
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }

        $payload = $request->all();
        if (isset($payload['medicines']) && is_array($payload['medicines'])) {
            foreach ($payload['medicines'] as $i => $m) {
                foreach (['code','generic_name','brand_name','description','expiry_date','dosage_instructions','side_effects','contraindications'] as $nf) {
                    if (array_key_exists($nf, $m) && $m[$nf] === '') {
                        $payload['medicines'][$i][$nf] = null;
                    }
                }
                foreach (['unit_buying_price','selling_price','minimum_stock'] as $nf) {
                    if (array_key_exists($nf, $m) && $m[$nf] === '') {
                        $payload['medicines'][$i][$nf] = 0;
                    }
                }
                if (isset($m['balance']) && $m['balance'] !== '' && !is_numeric($m['balance'])) {
                    $payload['medicines'][$i]['balance'] = (float) $m['balance'];
                }
                foreach (['has_expiry', 'prescription_required', 'controlled_substance'] as $flag) {
                    if (array_key_exists($flag, $m)) {
                        if ($m[$flag] === true) $payload['medicines'][$i][$flag] = 'Yes';
                        if ($m[$flag] === false) $payload['medicines'][$i][$flag] = 'No';
                    }
                }
            }
        }

        $validator = Validator::make($payload, [
            'medicines' => 'required|array|min:1',
            'medicines.*.name' => 'required|string|max:255',
            'medicines.*.code' => 'nullable|string|max:100',
            'medicines.*.generic_name' => 'nullable|string|max:255',
            'medicines.*.brand_name' => 'nullable|string|max:255',
            'medicines.*.description' => 'nullable|string',
            'medicines.*.unit_of_measure_id' => 'required|exists:units_of_measure,id',
            'medicines.*.balance' => 'required|numeric|min:0',
            'medicines.*.unit_buying_price' => 'nullable|numeric|min:0',
            'medicines.*.selling_price' => 'nullable|numeric|min:0',
            'medicines.*.expiry_date' => 'nullable|date',
            'medicines.*.minimum_stock' => 'nullable|numeric|min:0',
            'medicines.*.has_expiry' => 'required|in:Yes,No',
            'medicines.*.prescription_required' => 'required|in:Yes,No',
            'medicines.*.controlled_substance' => 'required|in:Yes,No',
            'medicines.*.dosage_instructions' => 'nullable|string',
            'medicines.*.side_effects' => 'nullable|string',
            'medicines.*.contraindications' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $createdMedicines = DB::transaction(function () use ($payload, $clinic_id) {
                $out = [];
                $medicineColumns = Schema::getColumnListing('medicines');
                foreach ($payload['medicines'] as $medicineData) {
                    if (($medicineData['has_expiry'] ?? 'No') === 'No') {
                        $medicineData['expiry_date'] = null;
                    }

                    $attributes = [
                        'clinic_id' => $clinic_id,
                        'name' => $medicineData['name'],
                        'code' => $medicineData['code'] ?? null,
                        'generic_name' => $medicineData['generic_name'] ?? null,
                        'brand_name' => $medicineData['brand_name'] ?? null,
                        'description' => $medicineData['description'] ?? null,
                        'unit_of_measure_id' => $medicineData['unit_of_measure_id'],
                        'balance' => $medicineData['balance'],
                        'new_balance' => $medicineData['balance'],
                        'unit_buying_price' => $medicineData['unit_buying_price'] ?? 0,
                        'selling_price' => $medicineData['selling_price'] ?? 0,
                        'expiry_date' => $medicineData['expiry_date'] ?? null,
                        'minimum_stock' => $medicineData['minimum_stock'] ?? 0,
                        'has_expiry' => $medicineData['has_expiry'],
                        'prescription_required' => $medicineData['prescription_required'],
                        'controlled_substance' => $medicineData['controlled_substance'],
                        'dosage_instructions' => $medicineData['dosage_instructions'] ?? null,
                        'side_effects' => $medicineData['side_effects'] ?? null,
                        'contraindications' => $medicineData['contraindications'] ?? null,
                        'status' => 'Active',
                    ];

                    $attributes = array_intersect_key($attributes, array_flip($medicineColumns));
                    $medicine = Medicine::create($attributes);
                    $out[] = $medicine->load(['clinic', 'unit_of_measure']);
                }
                return $out;
            });

            return response()->json([
                'success' => true,
                'message' => count($createdMedicines) . ' medicine(s) created successfully',
                'data' => $createdMedicines
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            \Log::error('Medicines bulkCreate failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error creating medicines',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}