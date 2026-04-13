<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderWiseItemVerify extends Model
{

    protected $table = 'order_wise_item_verifies';
    protected $fillable = [
        'order_id',
        'item_id',
        'item_quantity',
        'item_price',
        'item_name',
        'item_verifier_by',
        'item_verified_at',
        'purchased_at',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function item()
    {
        return $this->belongsTo(OrderItem::class, 'item_id');
    }
}
