<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MasterProduct;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MasterProduct::factory()
            ->count(5)
            ->create()
            ->each(function ($product) {
                Category::factory()->count(3)->create([
                    'master_product_id' => $product->id
                ]);
            });
    }
}
