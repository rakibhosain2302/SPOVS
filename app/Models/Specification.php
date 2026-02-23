<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specification extends Model
{
    protected $table = 'product_specs';
    protected $fillable = ['base_id', 'category_id', 'spec_name'];

    public function base()
    {
        return $this->belongsTo(ProductBase::class, 'base_id');
    }

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }
}
