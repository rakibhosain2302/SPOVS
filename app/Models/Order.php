<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'guest_id',
        'total_amount',
        'payment_method',
        'payment_details',
        'status',
        'order_date',
    ];

    protected $hasTimestamps = true;

    protected $casts = [
        'order_date' => 'datetime',
        'payment_details' => 'array',
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class, 'guest_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function qr()
    {
        return $this->hasMany(QRCode::class, 'order_id');
    }




}
