<?php

namespace App\Models;

use App\Models\Order;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    protected $table = 'guests';
    protected $fillable = [
        'name',
        'email',
        'phone',
        'terms',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class, 'guest_id');
    }
}
