<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QRCode extends Model
{
    protected $table = 'qr_codes';
    protected $fillable = ['order_id', 'token', 'status'];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
