<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'video_url',
        'social_links',
        'category',
        'tags',
        'is_top_story',
        'status',
        'published_at',
        'created_by',
    ];

    protected $casts = [
        'social_links' => 'array',
        'is_top_story' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeTopStories($query)
    {
        return $query->where('is_top_story', true)->published();
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
