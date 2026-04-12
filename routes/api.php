<?php

use App\Http\Controllers\Api\BaseController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductMasterController;
use App\Http\Controllers\Api\SpecController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Current logged-in user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::apiResource('bases', BaseController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('specifications', SpecController::class);
Route::apiResource('master_products', ProductMasterController::class);


Route::get('/products-list', [OrderController::class, 'products']);
Route::post('/orders', [OrderController::class, 'placeOrder']);
Route::get('/orders/{id}', [OrderController::class, 'orderConfirmation']);

