<?php

namespace App\Models;

use App\Models\Order;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasUuid;
    protected $table = 'customers';
    protected $fillable = [
        'uuid',
        'name',
        'email',
        'phone',
        'terms',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    public function qrCodes()
    {
        return $this->hasMany(QRCode::class, 'customer_id');
    }

}
