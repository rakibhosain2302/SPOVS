<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'master_product_id',
        'category_id',
        'specification_id',
        'product_price_id',
        'sku'
    ];
}
