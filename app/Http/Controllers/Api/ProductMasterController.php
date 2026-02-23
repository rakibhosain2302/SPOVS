<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductMaster;
use Illuminate\Http\Request;

class ProductMasterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ProductMaster::with('base', 'category', 'specification')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:product_masters,name',
            'price' => 'required|numeric',
            'available_quantity' => 'nullable|numeric',
            'base_id' => 'required|exists:product_bases,id',
            'category_id' => 'required|exists:product_categories,id',
            'specification_id' => 'required|exists:product_specs,id'
        ]);
        

        return ProductMaster::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return ProductMaster::with('base', 'category', 'specification')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'sometimes|required',
            'price' => 'sometimes|required|numeric',
            'available_quantity' => 'sometimes|nullable|numeric',
            'base_id' => 'sometimes|required|exists:product_bases,id',
            'category_id' => 'sometimes|required|exists:product_categories,id',
            'specification_id' => 'sometimes|nullable|exists:product_specs,id'
        ]);

        $master = ProductMaster::findOrFail($id);
        $master->update($request->all());
        return $master;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $master = ProductMaster::findOrFail($id);
        $master->delete();
        return $master;
    }
}
