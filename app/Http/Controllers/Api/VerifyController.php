<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderWiseItemVerify;
use App\Models\QRCode;
use Illuminate\Http\Request;

class VerifyController extends Controller
{

    public function verifyByToken(Request $request, $tokenData)
    {
        $parts = explode('|', $tokenData);
        
        if (count($parts) !== 2) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Invalid QR code format'
            ], 400);
        }

        [$token, $orderUuid] = $parts;

        $qr = QRCode::where('token', $token)->first();

        if (!$qr) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'QR token not found'
            ], 404);
        }

        $order = Order::where('uuid', $orderUuid)->first();

        if (!$order || $order->id !== $qr->order_id) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Order UUID does not match'
            ], 404);
        }

        // Check if already used
        if ($qr->status === 'used') {
            // Get the first order item
            $orderItem = $order->items()->first();

            return response()->json([
                'status' => 'used',
                'message' => 'This product has already been used',
                'name' => $order->customer->name,
                'order_id' => $order->id,
                'order_date' => $order->order_date->format('Y-m-d H:i:s'),
                'item_name' => $orderItem?->product->name ?? 'Product',
                'used_at' => $qr->updated_at->format('Y-m-d H:i:s')
            ], 200);
        }

        $orderItem = $order->items()->first();

        if (!$orderItem) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'No items found in this order'
            ], 400);
        }

        // Calculate already verified quantity
        $verifiedQty = OrderWiseItemVerify::where('item_id', $orderItem->id)->sum('item_quantity');
        $remaining = $orderItem->quantity - $verifiedQty;

        // Check if item quantity is 0 or less
        if ($orderItem->quantity <= 0) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'This product has no quantity remaining'
            ], 400);
        }

        // Check if all items have been verified
        if ($remaining <= 0) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'All quantities of this product have already been verified'
            ], 400);
        }

        // Everything is valid
        return response()->json([
            'status' => 'valid',
            'message' => 'Product is valid',
            'name' => $order->customer->name,
            'order_id' => $order->id,
            'order_uuid' => $order->uuid,
            'order_date' => $order->order_date->format('Y-m-d H:i:s'),
            'total_quantity' => $orderItem->quantity,
            'remaining' => $remaining,
            'item_id' => $orderItem->id,
            'item_name' => $orderItem->product->name ?? 'Product',
            'item_price' => $orderItem->price,
            'verifier_by' => 'staff',
            'total_amount' => $order->total
        ], 200);
    }

    
    public function markAsUsed(Request $request, $tokenData)
    {
        // Parse the token data
        $parts = explode('|', $tokenData);
        
        if (count($parts) !== 2) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Invalid QR code format'
            ], 400);
        }

        [$token, $orderUuid] = $parts;

        // Find QR code by token
        $qr = QRCode::where('token', $token)->first();

        if (!$qr) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'QR token not found'
            ], 404);
        }

        // Verify the UUID matches
        $order = Order::where('uuid', $orderUuid)->first();

        if (!$order || $order->id !== $qr->order_id) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Order UUID does not match'
            ], 404);
        }

        // Check if already used
        if ($qr->status === 'used') {
            $orderItem = $order->items()->first();
            return response()->json([
                'status' => 'used',
                'message' => 'This product has already been used',
                'name' => $order->customer->name,
                'order_id' => $order->id,
                'item_name' => $orderItem?->product->name ?? 'Product',
                'used_at' => $qr->updated_at->format('Y-m-d H:i:s')
            ], 200);
        }

        // Mark as used
        $qr->update(['status' => 'used']);

        // Get the first order item
        $orderItem = $order->items()->first();
        
        return response()->json([
            'status' => 'valid',
            'message' => 'Product marked as used',
            'name' => $order->customer->name,
            'order_id' => $order->id,
            'item_name' => $orderItem?->product->name ?? 'Product'
        ], 200);
    }


    public function orderVerifyStore(Request $request){
            $request->validate([
                'order_id' => 'required|exists:orders,id',
                'item_id' => 'required|exists:order_items,id',
                'item_quantity' => 'required|integer|min:1',
                'item_price' => 'required|numeric|min:0',
                'item_name' => 'required|string|max:255',
                'item_verifier_by' => 'nullable|string|max:255',
                'item_verified_at' => 'required|date',
                'purchased_at' => 'required|date',
            ]);
    
            $verify = new OrderWiseItemVerify();
            $verify->order_id = $request->order_id;
            $verify->item_id = $request->item_id;
            $verify->item_quantity = $request->item_quantity;
            $verify->item_price = $request->item_price;
            $verify->item_name = $request->item_name;
            $verify->item_verifier_by = $request->item_verifier_by;
            $verify->item_verified_at = $request->item_verified_at;
            $verify->purchased_at = $request->purchased_at;
            $verify->save();

            // Reduce quantity from order_items table
            $orderItem = OrderItem::find($request->item_id);
            if ($orderItem) {
                $orderItem->decrement('quantity', $request->item_quantity);
            }
    
            return response()->json([
                'status' => 'success',
                'message' => 'Order item verified successfully',
                'data' => $verify
            ], 201);
    }

    public function orderVerifyList()
    {
        $verifications = OrderWiseItemVerify::with(['order.customer', 'item.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $verifications
        ], 200);
    }

    public function orderVerifyShow($id)
    {
        $verification = OrderWiseItemVerify::with(['order.customer', 'item.product'])->find($id);

        if (!$verification) {
            return response()->json([
                'status' => 'error',
                'message' => 'Verification record not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $verification
        ], 200);
    }

    public function orderVerifyUpdate(Request $request, $id)
    {
        $verification = OrderWiseItemVerify::find($id);

        if (!$verification) {
            return response()->json([
                'status' => 'error',
                'message' => 'Verification record not found'
            ], 404);
        }

        $request->validate([
            'order_id' => 'sometimes|required|exists:orders,id',
            'item_id' => 'sometimes|required|exists:order_items,id',
            'item_quantity' => 'sometimes|required|integer|min:1',
            'item_price' => 'sometimes|required|numeric|min:0',
            'item_name' => 'sometimes|required|string|max:255',
            'item_verifier_by' => 'nullable|string|max:255',
            'item_verified_at' => 'sometimes|required|date',
            'purchased_at' => 'sometimes|required|date',
        ]);

        $verification->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Verification record updated successfully',
            'data' => $verification
        ], 200);
    }

    public function orderVerifyDestroy($id)
    {
        $verification = OrderWiseItemVerify::find($id);

        if (!$verification) {
            return response()->json([
                'status' => 'error',
                'message' => 'Verification record not found'
            ], 404);
        }

        $verification->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Verification record deleted successfully'
        ], 200);
    }

}

