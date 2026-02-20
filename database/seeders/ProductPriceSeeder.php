<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Specification;
use App\Models\ProductPrice;

class ProductPriceSeeder extends Seeder
{
    public function run(): void
    {
        $specifications = Specification::all();

        foreach ($specifications as $specification) {

            ProductPrice::create([
                'specification_id' => $specification->id,
                'price' => rand(1000, 10000)
            ]);
        }
    }
}
