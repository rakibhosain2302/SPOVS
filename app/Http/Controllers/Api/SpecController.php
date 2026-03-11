<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductSpec;
use Illuminate\Http\Request;

class SpecController extends Controller
{
    public function index() {
        return ProductSpec::with('base','category')->get();
    }

    public function store(Request $request) {
        $request->validate([
            'spec_name'=>'required',
            'base_id'=>'required|exists:product_bases,id',
            'category_id'=>'required|exists:product_categories,id'
        ]);
        return ProductSpec::create($request->all());
    }

    public function show($id) {
        return ProductSpec::with('base','category')->findOrFail($id);
    }

    public function update(Request $request, $id) {
        $spec = ProductSpec::findOrFail($id);
        $spec->update($request->all());
        return $spec;
    }

    public function destroy($id) {
        $spec = ProductSpec::findOrFail($id);
        $spec->delete();
        return response()->json(['message'=>'Spec deleted']);
    }
}