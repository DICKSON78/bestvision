<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Marketing\BlogPost;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class BlogPostsController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $request->validate([
            'per_page' => 'sometimes|integer|min:0',
            'page' => 'sometimes|integer|min:1',
            'status' => 'sometimes|string',
            'category' => 'sometimes|string',
            'q' => 'sometimes|string',
        ]);

        $user = $request->user();
        $per_page = $request->per_page ?? 25;
        $data = BlogPost::with(['creator']);

        if (!$user->is_admin) {
            $data->where('created_by', $user->id);
        }

        if ($request->status) {
            $data->where('status', $request->status);
        }

        if ($request->category) {
            $data->where('category', $request->category);
        }

        if ($request->q) {
            $data->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->q . '%')
                  ->orWhere('excerpt', 'like', '%' . $request->q . '%');
            });
        }

        $data->orderBy('created_at', 'desc');
        $data = $data->paginate($per_page);
        return $this->sendResponse($data, Response::HTTP_OK, 'Success.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'content' => 'required',
            'excerpt' => 'nullable',
            'featured_image' => 'nullable',
            'category' => 'nullable',
            'tags' => 'nullable',
            'status' => 'sometimes|in:draft,published',
        ]);

        $input = $request->all();
        $input['created_by'] = $request->user()->id;
        $input['slug'] = Str::slug($request->title);

        if ($request->status == 'published') {
            $input['published_at'] = Carbon::now();
        }

        $data = BlogPost::create($input);
        return $this->sendResponse($data, Response::HTTP_OK, 'Created successfully.');
    }

    public function show($id)
    {
        $data = BlogPost::with(['creator'])->findOrFail($id);
        return $this->sendResponse($data, Response::HTTP_OK, 'Success.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|required',
            'content' => 'sometimes|required',
            'excerpt' => 'nullable',
            'featured_image' => 'nullable',
            'category' => 'nullable',
            'tags' => 'nullable',
            'status' => 'sometimes|in:draft,published',
        ]);

        $data = BlogPost::findOrFail($id);
        $input = $request->all();

        if ($request->has('title') && $request->title != $data->title) {
            $input['slug'] = Str::slug($request->title);
        }

        if ($request->status == 'published' && $data->status != 'published') {
            $input['published_at'] = Carbon::now();
        }

        if ($request->status == 'draft' && $data->status == 'published') {
            $input['published_at'] = null;
        }

        $data->update($input);
        return $this->sendResponse($data, Response::HTTP_OK, 'Saved successfully.');
    }

    public function destroy($id)
    {
        $data = BlogPost::findOrFail($id);
        $data->delete();
        return $this->sendResponse($data, Response::HTTP_OK, 'Deleted successfully.');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $file = $request->file('image');
        $filename = time() . '_' . uniqid() . '.' . $file->extension();
        $file->move(public_path('uploads/blog'), $filename);

        return $this->sendResponse([
            'url' => url('uploads/blog/' . $filename),
        ], Response::HTTP_OK, 'Uploaded successfully.');
    }
}
