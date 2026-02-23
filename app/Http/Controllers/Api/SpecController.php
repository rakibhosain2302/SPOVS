<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Specification;

class SpecController extends Controller
{
    public function index() {
        return Specification::with('base','category')->get();
    }

    public function store(Request $request) {
        $request->validate([
            'spec_name'=>'required',
            'base_id'=>'required|exists:product_bases,id',
            'category_id'=>'required|exists:product_categories,id'
        ]);
        return Specification::create($request->all());
    }

    public function show($id) {
        return Specification::with('base','category')->findOrFail($id);
    }

    public function update(Request $request, $id) {
        $spec = Specification::findOrFail($id);
        $spec->update($request->all());
        return $spec;
    }

    public function destroy($id) {
        $spec = Specification::findOrFail($id);
        $spec->delete();
        return response()->json(['message'=>'Spec deleted']);
    }
}