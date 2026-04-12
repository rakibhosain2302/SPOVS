<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class QRCode extends Model
{
    use HasUuid;
    protected $table = 'qr_codes';
    protected $fillable = ['uuid', 'customer_id', 'order_id', 'token', 'status'];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
}
