<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialMediaAccount extends Model
{
    protected $fillable = [
        'platform',
        'account_name',
        'page_id',
        'access_token',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
