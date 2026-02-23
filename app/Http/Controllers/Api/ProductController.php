<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\ProductBase;
use App\Models\Specification;

class ProductController extends Controller
{
    public function bases()
    {
        $bases = ProductBase::all();
        return response()->json($bases);
    }

    public function createBase(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:products_base,name',
        ]);

        $base = ProductBase::create([
            'name' => $request->name
        ]);

        return response()->json($base, 201);
    }

    public function categories($base_id)
    {
        $categories = Category::where('base_id', $base_id)->get();
        return response()->json($categories);
    }

    public function createCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:products_categories,name',
            'base_id' => 'required|exists:products_base,id',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'base_id' => $request->base_id
        ]);

        return response()->json($category, 201);
    }

    public function specs($base_id, $category_id)
    {
        $specs = Specification::where('base_id', $base_id)
            ->where('category_id', $category_id)
            ->get();

        return response()->json($specs);
    }

    public function createSpec(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'base_id' => 'required|exists:products_base,id',
            'category_id' => 'required|exists:products_categories,id',
        ]);

        $spec = Specification::create([
            'name' => $request->name,
            'base_id' => $request->base_id,
            'category_id' => $request->category_id
        ]);

        return response()->json($spec, 201);
    }
}
