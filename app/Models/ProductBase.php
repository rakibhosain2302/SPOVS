<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductBase extends Model
{
    protected $table = 'product_bases';
    protected $fillable = [
        'name'
    ];

    public function categories()
    {
        return $this->hasMany(ProductCategory::class, 'base_id');
    }

    public function specs()
    {
        return $this->hasMany(ProductSpec::class, 'base_id');
    }
}
