<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MasterProduct;

class MasterProductSeeder extends Seeder
{
    public function run(): void
    {
        MasterProduct::factory()->count(20)->create();
    }
}
