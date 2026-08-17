<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponse;
use App\Models\SocialMediaAccount;
use Illuminate\Http\Request;

class SocialMediaAccountController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $accounts = SocialMediaAccount::orderBy('platform')->get();
        return $this->sendResponse($accounts, 200);
    }

    public function connected()
    {
        $accounts = SocialMediaAccount::active()->select('id', 'platform', 'account_name')->get();
        return $this->sendResponse($accounts, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'platform' => 'required|in:facebook,instagram',
            'account_name' => 'required|string|max:255',
            'page_id' => 'nullable|string|max:255',
            'access_token' => 'required|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $account = SocialMediaAccount::create($request->only([
            'platform', 'account_name', 'page_id', 'access_token', 'is_active',
        ]));

        return $this->sendResponse($account, 201, 'Account saved successfully.');
    }

    public function update(Request $request, $id)
    {
        $account = SocialMediaAccount::findOrFail($id);

        $request->validate([
            'platform' => 'sometimes|in:facebook,instagram',
            'account_name' => 'sometimes|string|max:255',
            'page_id' => 'nullable|string|max:255',
            'access_token' => 'sometimes|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $account->update($request->only([
            'platform', 'account_name', 'page_id', 'access_token', 'is_active',
        ]));

        return $this->sendResponse($account, 200, 'Account updated.');
    }

    public function destroy($id)
    {
        $account = SocialMediaAccount::findOrFail($id);
        $account->delete();
        return $this->sendResponse([], 200, 'Account deleted.');
    }

    public function toggle($id)
    {
        $account = SocialMediaAccount::findOrFail($id);
        $account->update(['is_active' => !$account->is_active]);
        return $this->sendResponse($account, 200, $account->is_active ? 'Account activated.' : 'Account deactivated.');
    }
}
