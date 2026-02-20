<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;

class SpecificationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'name' => $this->faker->randomElement([
                'Size',
                'Color',
                'Weight',
                'Material',
                'Capacity'
            ]),
        ];
    }
}
