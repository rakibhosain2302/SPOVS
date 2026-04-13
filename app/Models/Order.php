<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasUuid;

    protected $table = 'orders';

    protected $fillable = [
        'uuid',
        'customer_id',
        'total',
        'payment_method',
        'payment_details',
        'payment_status',
        'order_date',
    ];

    protected $hasTimestamps = true;

    protected $casts = [
        'order_date' => 'datetime',
        'payment_details' => 'array',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function qr()
    {
        return $this->hasMany(QRCode::class, 'order_id');
    }

    public function itemVerifies()
    {
        return $this->hasMany(OrderWiseItemVerify::class, 'order_id');
    }




}
