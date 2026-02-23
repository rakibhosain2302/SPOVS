<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductMaster extends Model
{
    protected $table = 'product_masters';
    protected $fillable = [
        'base_id',
        'category_id',
        'specification_id',
        'name',
        'price',
        'available_quantity',
    ];

    public function base()
    {
        return $this->belongsTo(ProductBase::class, 'base_id');
    }

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function specification()
    {
        return $this->belongsTo(Specification::class, 'specification_id');
    }
}
