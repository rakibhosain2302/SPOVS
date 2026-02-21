<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\MasterProduct;
use App\Models\Specification;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    public function masters(Request $request)
    {
        return MasterProduct::with('categories')->where('status', 1)->get();
    }

    public function categories($id)
    {
        return Category::where('master_product_id', $id)->get();
    }

    public function specs($id)
    {
        return Specification::with('price')->where('category_id', $id)->get();
    }
}
