<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    protected $table = 'product_categories';
    protected $fillable = ['base_id', 'name'];

    public function base()
    {
        return $this->belongsTo(ProductBase::class, 'base_id');
    }
    public function specs()
    {
        return $this->hasMany(Specification::class, 'category_id');
    }
}
