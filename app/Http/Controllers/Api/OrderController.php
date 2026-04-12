<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductMaster;
use App\Models\QRCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{

    // Products Page → fetch products with price
    public function products()
    {
        // Eager load the spec relation (note: relation is named `specs` on ProductMaster)
        $products = ProductMaster::with('specification')->get();

        $formatted = $products->map(function ($product) {
             $specName = optional($product->specification)->spec_name;

            return [
                'id' => $product->id,
                'name' => $specName ? $specName : $product->name,
                'price' => $product->price,
                'available_quantity' => $product->available_quantity,
            ];
        });

        return response()->json($formatted);
    }



    // Checkout & Payment → save order + order items + generate QR
    public function placeOrder(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'email' => 'nullable|email',
            'terms' => 'required|boolean',

            'payment_method' => 'required|string',
            'payment_details' => 'required|array',

            'items' => 'required|array|min:1',
            // product ids come from product_masters table
            'items.*.product_id' => 'required|exists:product_masters,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {

            // ✅ 1️⃣ Guest (avoid duplicate by phone)
            $guest = Customer::firstOrCreate(
                ['phone' => $validated['phone']],
                [
                    'name' => $validated['name'],
                    'email' => $validated['email'] ?? null,
                    'terms' => $validated['terms'],
                ]
            );

            $totalAmount = 0;

            // ✅ 2️⃣ Create Order (initially pending) - set order_date
            $order = Order::create([
                'customer_id' => $guest->id,
                'total' => 0,
                'payment_method' => $validated['payment_method'],
                'payment_details' => $validated['payment_details'],
                'payment_status' => 'completed',
                'order_date' => now(),
            ]);

            // ✅ 3️⃣ Save Order Items (secure price from DB)
            foreach ($validated['items'] as $item) {

                // fetch the product master to get the authoritative price
                $product = ProductMaster::findOrFail($item['product_id']);

                $lineTotal = $item['quantity'] * $product->price;
                $totalAmount += $lineTotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);
            }

            // ✅ 4️⃣ Update total amount
            $order->update([
                'total' => $totalAmount
            ]);

            // ✅ 5️⃣ Generate QR Token
            $token = 'QR-' . strtoupper(Str::random(12));

            QRCode::create([
                'customer_id' => $guest->id,
                'order_id' => $order->id,
                'token' => $token,
                'status' => 'valid'
            ]);

            DB::commit();

            // Explicitly format the response to ensure uuid is included
            $orderData = $order->load('items.product', 'customer', 'qr')->toArray();
            $orderData['uuid'] = $order->uuid; // Ensure uuid is in response

            return response()->json([
                'order' => $orderData,
                'message' => 'Order placed successfully'
            ]);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Order Confirmation → show order by ID
    public function orderConfirmation($order_id)
    {
        $order = Order::with('items.product', 'customer', 'qr')->findOrFail($order_id);
        $orderData = $order->toArray();
        $orderData['uuid'] = $order->uuid; // Ensure uuid is in response
        return response()->json($orderData);
    }
}
