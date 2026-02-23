<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductBase;

class BaseController extends Controller
{
    public function index()
    {
        return ProductBase::all();
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:product_bases,name']);
        return ProductBase::create($request->all());
    }

    public function show($id)
    {
        return ProductBase::with('categories', 'specs')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $base = ProductBase::findOrFail($id);
        $base->update($request->all());
        return $base;
    }

    public function destroy($id)
    {
        $base = ProductBase::findOrFail($id);
        $base->delete();
        return response()->json(['message' => 'Base deleted']);
    }
}
