<?php

use App\Http\Controllers\Api\BaseController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductMasterController;
use App\Http\Controllers\Api\SpecController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\BookingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Current logged-in user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::get('/master-products', [ProductController::class, 'masters']);
// Route::get('/categories/{id}', [ProductController::class, 'categories']);
// Route::get('/specifications/{id}', [ProductController::class, 'specs']);

Route::apiResource('bases', BaseController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('specifications', SpecController::class);
Route::apiResource('master_products', ProductMasterController::class);

// BookingControllers

// Route::post('/guest', [BookingController::class, 'saveGuest']);

Route::get('/tickets-list', [BookingController::class, 'tickets']);
Route::post('/orders', [BookingController::class, 'placeOrder']);
Route::get('/orders/{id}', [BookingController::class, 'orderConfirmation']); 

