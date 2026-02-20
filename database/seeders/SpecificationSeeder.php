<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Specification;

class SpecificationSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();

        foreach ($categories as $category) {

            Specification::create([
                'category_id' => $category->id,
                'name' => 'Basic'
            ]);

            Specification::create([
                'category_id' => $category->id,
                'name' => 'Standard'
            ]);

            Specification::create([
                'category_id' => $category->id,
                'name' => 'Premium'
            ]);
        }
    }
}
