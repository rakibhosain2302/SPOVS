<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Specification;

class ProductPriceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'specification_id' => Specification::factory(),
            'price' => $this->faker->randomFloat(2, 100, 5000),
        ];
    }
}
