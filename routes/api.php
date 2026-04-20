<?php

use App\Http\Controllers\Api\BaseController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductMasterController;
use App\Http\Controllers\Api\SpecController;
use App\Http\Controllers\Api\VerifyController;
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
Route::get('/orders', [OrderController::class, 'listOrders']);
Route::post('/orders', [OrderController::class, 'placeOrder']);
Route::get('/orders/{id}', [OrderController::class, 'orderConfirmation']);

// Ticket verification routes (QR token format: token|uuid)
Route::get('/verify-order/{tokenData}', [VerifyController::class, 'verifyByToken']);
Route::post('/verify-ticket/{tokenData}', [VerifyController::class, 'markAsUsed']);

Route::post('/order-item-verify', [VerifyController::class, 'orderVerifyStore']);
Route::get('/order-item-verify', [VerifyController::class, 'orderVerifyList']);
Route::get('/order-item-verify/{id}', [VerifyController::class, 'orderVerifyShow']);
Route::put('/order-item-verify/{id}', [VerifyController::class, 'orderVerifyUpdate']);
Route::delete('/order-item-verify/{id}', [VerifyController::class, 'orderVerifyDestroy']);


