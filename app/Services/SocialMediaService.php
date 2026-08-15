<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SocialMediaService
{
    protected $fbPageId;
    protected $fbPageToken;
    protected $igUserId;

    public function __construct()
    {
        $this->fbPageId = config('services.facebook.page_id');
        $this->fbPageToken = config('services.facebook.page_token');
        $this->igUserId = config('services.instagram.user_id');
    }

    protected function pageAccessToken()
    {
        if (!$this->fbPageId || !$this->fbPageToken) {
            return null;
        }

        if (str_starts_with($this->fbPageToken, 'EAAG') || str_starts_with($this->fbPageToken, 'EAA')) {
            return $this->fbPageToken;
        }

        return $this->fbPageToken;
    }

    protected function resolvePageToken()
    {
        $token = $this->fbPageToken;
        if (!$token) {
            return null;
        }

        $cachedToken = \Illuminate\Support\Facades\Cache::get('fb_page_token_' . $this->fbPageId);
        if ($cachedToken) {
            return $cachedToken;
        }

        $check = Http::get("https://graph.facebook.com/v20.0/{$this->fbPageId}", [
            'fields' => 'id,name',
            'access_token' => $token,
        ]);

        if ($check->successful()) {
            \Illuminate\Support\Facades\Cache::put('fb_page_token_' . $this->fbPageId, $token, now()->addHours(2));
            return $token;
        }

        // Fallback: exchange the user token for a page token
        $userToken = config('services.facebook.user_token');
        if (!$userToken) {
            return $token;
        }

        try {
            $accounts = Http::get("https://graph.facebook.com/v20.0/me/accounts", [
                'access_token' => $userToken,
            ])->json();

            foreach ($accounts['data'] ?? [] as $page) {
                if (isset($page['id']) && $page['id'] == $this->fbPageId) {
                    $pageToken = $page['access_token'] ?? null;
                    if ($pageToken) {
                        \Illuminate\Support\Facades\Cache::put('fb_page_token_' . $this->fbPageId, $pageToken, now()->addHours(2));
                        return $pageToken;
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Failed to exchange user token for page token', ['error' => $e->getMessage()]);
        }

        return $token;
    }

    public function sharePost($post, array $platforms = [])
    {
        $results = [];

        if (in_array('facebook', $platforms)) {
            $results['facebook'] = $this->postToFacebook($post);
        }

        if (in_array('instagram', $platforms)) {
            $results['instagram'] = $this->postToInstagram($post);
        }

        return $results;
    }

    protected function buildMessage($post)
    {
        $title = $post->title;
        $excerpt = $post->excerpt ?? '';
        $url = url('/blog/' . $post->slug);

        $message = "{$title}\n\n{$excerpt}\n\nRead more: {$url}";
        return trim($message);
    }

    public function postToFacebook($post)
    {
        if (!$this->fbPageId || !$this->fbPageToken) {
            Log::warning('Facebook credentials missing');
            return ['success' => false, 'error' => 'Facebook credentials missing'];
        }

        $token = $this->resolvePageToken();
        $message = $this->buildMessage($post);
        $params = [
            'message' => $message,
            'access_token' => $token,
        ];

        // Try image post first (download + binary upload is more reliable than URL)
        if ($post->featured_image) {
            $imageBinary = $this->downloadImage($post->featured_image);
            if ($imageBinary) {
                $photoResp = Http::asMultipart()->post(
                    "https://graph.facebook.com/v20.0/{$this->fbPageId}/photos",
                    [
                        'message' => $message,
                        'access_token' => $token,
                        'source' => $imageBinary,
                    ]
                );

                if ($photoResp->successful()) {
                    return $this->parseResponse($photoResp, 'facebook');
                }

                Log::warning('Facebook binary photo post failed', ['response' => $photoResp->json()]);
            }

            // Fallback: use URL
            $params['url'] = $post->featured_image;
            $response = Http::post("https://graph.facebook.com/v20.0/{$this->fbPageId}/photos", $params);

            if (!$response->successful()) {
                Log::warning('Facebook photo post failed, falling back to link post', ['response' => $response->json()]);
                $params['link'] = url('/blog/' . $post->slug);
                unset($params['url']);
                $response = Http::post("https://graph.facebook.com/v20.0/{$this->fbPageId}/feed", $params);
            }
        } else {
            $params['link'] = url('/blog/' . $post->slug);
            $response = Http::post("https://graph.facebook.com/v20.0/{$this->fbPageId}/feed", $params);
        }

        return $this->parseResponse($response, 'facebook');
    }

    protected function downloadImage($url)
    {
        if (!$url) return null;
        try {
            $response = Http::timeout(30)->withOptions(['allow_redirects' => true])->get($url);
            if (!$response->successful()) {
                Log::warning('Image download failed status', ['url' => $url, 'status' => $response->status()]);
                return null;
            }

            $tmp = tempnam(sys_get_temp_dir(), 'fbimg');
            if (!$tmp) return null;
            file_put_contents($tmp, $response->body());

            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime = $finfo ? finfo_file($finfo, $tmp) : 'image/jpeg';
            finfo_close($finfo);

            $ext = match ($mime) {
                'image/png' => 'png',
                'image/gif' => 'gif',
                'image/webp' => 'webp',
                'image/jpeg' => 'jpg',
                default => 'jpg',
            };

            $path = $tmp . '.' . $ext;
            rename($tmp, $path);

            $file = new \Illuminate\Http\UploadedFile(
                $path,
                basename($path),
                $mime,
                null,
                true
            );

            return $file;
        } catch (\Throwable $e) {
            Log::warning('Image download failed', ['url' => $url, 'error' => $e->getMessage()]);
        }
        return null;
    }

    public function postToInstagram($post)
    {
        if (!$this->igUserId || !$this->fbPageToken) {
            Log::warning('Instagram credentials missing');
            return ['success' => false, 'error' => 'Instagram credentials missing'];
        }

        if (!$post->featured_image) {
            return ['success' => false, 'error' => 'Featured image required for Instagram'];
        }

        $caption = $post->title;
        if ($post->excerpt) {
            $caption .= "\n\n" . mb_substr($post->excerpt, 0, 100);
        }
        $caption .= "\n\nVisit us: " . url('/blog/' . $post->slug);

        // Step 1: Create media container
        $container = Http::post("https://graph.facebook.com/v20.0/{$this->igUserId}/media", [
            'image_url' => $post->featured_image,
            'caption' => mb_substr($caption, 0, 2200),
            'access_token' => $this->fbPageToken,
        ]);

        $containerData = $container->json();

        if (!$container->successful() || empty($containerData['id'])) {
            Log::error('Instagram container creation failed', ['response' => $containerData]);
            return ['success' => false, 'error' => $containerData['error']['message'] ?? 'Container creation failed'];
        }

        // Step 2: Publish the container
        $publish = Http::post("https://graph.facebook.com/v20.0/{$this->igUserId}/media_publish", [
            'creation_id' => $containerData['id'],
            'access_token' => $this->fbPageToken,
        ]);

        return $this->parseResponse($publish, 'instagram');
    }

    protected function parseResponse($response, $platform)
    {
        $data = $response->json();

        if ($response->successful() && !empty($data['id'])) {
            Log::info("{$platform} post successful", ['id' => $data['id']]);
            return ['success' => true, 'post_id' => $data['id']];
        }

        Log::error("{$platform} post failed", ['response' => $data]);
        return ['success' => false, 'error' => $data['error']['message'] ?? 'Unknown error'];
    }
}
