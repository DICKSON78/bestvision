<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponse;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $request->validate([
            'per_page' => 'sometimes|integer|min:1|max:50',
            'page' => 'sometimes|integer|min:1',
        ]);

        $per_page = $request->per_page ?? 12;
        $category = $request->category;
        $tag = $request->tag;
        $q = $request->q;

        $data = BlogPost::published()->orderBy('published_at', 'desc');

        if ($category) {
            $data->where('category', $category);
        }

        if ($tag) {
            $data->where('tags', 'like', '%' . $tag . '%');
        }

        if ($q) {
            $data->where(function ($query) use ($q) {
                $query->where('title', 'like', '%' . $q . '%')
                      ->orWhere('content', 'like', '%' . $q . '%')
                      ->orWhere('tags', 'like', '%' . $q . '%');
            });
        }

        $data = $data->paginate($per_page);
        return $this->sendResponse($data, Response::HTTP_OK, 'Success.');
    }

    public function topStories(Request $request)
    {
        $limit = min($request->limit ?? 5, 10);

        $data = BlogPost::topStories()
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();

        return $this->sendResponse($data, Response::HTTP_OK, 'Success.');
    }

    public function showBySlug($slug)
    {
        $post = BlogPost::where('slug', $slug)->published()->first();

        if (!$post) {
            return $this->sendError('Blog post not found.', Response::HTTP_NOT_FOUND);
        }

        return $this->sendResponse($post, Response::HTTP_OK, 'Success.');
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|string|max:500',
            'video_url' => 'nullable|string|max:500',
            'social_links' => 'nullable|array',
            'category' => 'required|string|max:100',
            'tags' => 'nullable|string|max:255',
            'is_top_story' => 'sometimes|boolean',
            'status' => 'sometimes|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        $input = $request->only([
            'title', 'content', 'excerpt', 'featured_image', 'video_url',
            'social_links', 'category', 'tags', 'is_top_story', 'status', 'published_at',
        ]);

        $input['slug'] = Str::slug($request->title);
        $input['created_by'] = $user->id;

        if ($request->status === 'published' && !$request->published_at) {
            $input['published_at'] = now();
        }

        $post = BlogPost::create($input);
        return $this->sendResponse($post, Response::HTTP_CREATED, 'Created successfully.');
    }

    public function show($id)
    {
        $post = BlogPost::with('creator')->findOrFail($id);
        return $this->sendResponse($post, Response::HTTP_OK, 'Success.');
    }

    public function update(Request $request, $id)
    {
        $post = BlogPost::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|string|max:500',
            'video_url' => 'nullable|string|max:500',
            'social_links' => 'nullable|array',
            'category' => 'sometimes|required|string|max:100',
            'tags' => 'nullable|string|max:255',
            'is_top_story' => 'sometimes|boolean',
            'status' => 'sometimes|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        $input = $request->only([
            'title', 'content', 'excerpt', 'featured_image', 'video_url',
            'social_links', 'category', 'tags', 'is_top_story', 'status', 'published_at',
        ]);

        if (isset($input['title']) && $input['title'] !== $post->title) {
            $input['slug'] = Str::slug($input['title']);
        }

        if (isset($input['status']) && $input['status'] === 'published' && !$post->published_at) {
            $input['published_at'] = now();
        }

        $post->update($input);
        return $this->sendResponse($post, Response::HTTP_OK, 'Saved successfully.');
    }

    public function destroy($id)
    {
        $post = BlogPost::findOrFail($id);
        $post->delete();
        return $this->sendResponse(null, Response::HTTP_OK, 'Deleted successfully.');
    }
}
