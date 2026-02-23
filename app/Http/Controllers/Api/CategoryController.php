<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index() {
        return ProductCategory::with('base')->get();
    }

    public function store(Request $request) {
        $request->validate([
            'name'=>'required|unique:product_categories,name',
            'base_id'=>'required|exists:product_bases,id'
        ]);
        return ProductCategory::create($request->all());
    }

    public function show($id) {
        return ProductCategory::with('base','specs')->findOrFail($id);
    }

    public function update(Request $request, $id) {
        $category = ProductCategory::findOrFail($id);
        $category->update($request->all());
        return $category;
    }

    public function destroy($id) {
        $category = ProductCategory::findOrFail($id);
        $category->delete();
        return response()->json(['message'=>'Category deleted']);
    }
}