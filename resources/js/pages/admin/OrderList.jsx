import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/orders');
            setOrders(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load orders');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-gray-600">Loading orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders</h1>
                    <p className="text-gray-600">Total Orders: {orders.length}</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
                        No orders found
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm font-semibold opacity-90">Order ID</p>
                                            <p className="text-2xl font-bold">{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold opacity-90">Customer</p>
                                            <p className="text-lg font-semibold">{order.customer?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold opacity-90">Order Date</p>
                                            <p className="text-lg">
                                                {new Date(order.order_date).toLocaleDateString('en-BD')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold opacity-90">Total Amount</p>
                                            <p className="text-2xl font-bold">
                                                ৳ {parseFloat(order.total).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer & Order Details */}
                                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-semibold text-gray-900">{order.customer?.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-semibold text-gray-900">
                                                {order.customer?.email || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Payment Method</p>
                                            <p className="font-semibold text-gray-900">{order.payment_method}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items Table */}
                                <div className="px-6 py-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b-2 border-gray-300">
                                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                                        Product
                                                    </th>
                                                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                                                        Quantity
                                                    </th>
                                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                                                        Price
                                                    </th>
                                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                                                        Subtotal
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items && order.items.length > 0 ? (
                                                    order.items.map((item, idx) => (
                                                        <tr
                                                            key={idx}
                                                            className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                                                        >
                                                            <td className="py-3 px-4 text-gray-900">
                                                                {item.product?.name || 'N/A'}
                                                            </td>
                                                            <td className="text-center py-3 px-4 text-gray-900">
                                                                {item.quantity}
                                                            </td>
                                                            <td className="text-right py-3 px-4 text-gray-900">
                                                                ৳ {parseFloat(item.price).toFixed(2)}
                                                            </td>
                                                            <td className="text-right py-3 px-4 font-semibold text-gray-900">
                                                                ৳{' '}
                                                                {(item.quantity * parseFloat(item.price)).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center py-4 text-gray-500">
                                                            No items in this order
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* QR Code Info */}
                                {order.qr && order.qr.length > 0 && (
                                    <div className="px-6 py-4 bg-green-50 border-t border-green-200">
                                        <p className="text-sm font-semibold text-green-900 mb-2">QR Code Token</p>
                                        <p className="font-mono text-sm text-green-700 break-all">
                                            {order.qr[0]?.token}
                                        </p>
                                        <p className="text-xs text-green-600 mt-1">
                                            Status: {order.qr[0]?.status || 'N/A'}
                                        </p>
                                    </div>
                                )}

                                {/* Payment Status */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <p className="text-sm font-semibold text-gray-700">Payment Status</p>
                                    <span
                                        className={`inline-block mt-2 px-4 py-2 rounded-full text-white font-semibold ${
                                            order.payment_status === 'completed'
                                                ? 'bg-green-500'
                                                : order.payment_status === 'pending'
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                        }`}
                                    >
                                        {order.payment_status?.toUpperCase() || 'UNKNOWN'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
