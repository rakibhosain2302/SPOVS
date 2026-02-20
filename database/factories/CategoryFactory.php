<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\MasterProduct;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'master_product_id' => MasterProduct::inRandomOrder()->value('id'),

            'name' => $this->faker->unique()->words(2, true),
        ];
    }
}
