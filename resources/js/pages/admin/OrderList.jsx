import React, { useEffect, useState } from 'react';
import axios from 'axios';

const formatDate = (value) => {
    if (!value) return 'N/A';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'N/A';
    return parsed.toLocaleDateString('en-BD');
};

const formatMoney = (value) => {
    const amount = Number.parseFloat(value);
    return Number.isNaN(amount) ? '0.00' : amount.toFixed(2);
};

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
            setOrders(response.data || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load orders');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid px-0">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
                <div>
                    <h2 className="mb-1">Orders</h2>
                    <p className="text-muted mb-0">Total Orders: {orders.length}</p>
                </div>
                <button className="btn btn-outline-primary" onClick={fetchOrders} type="button">
                    Refresh
                </button>
            </div>

            {loading && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted mt-3 mb-0">Loading orders...</p>
                    </div>
                </div>
            )}

            {!loading && error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="card border-0 shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Contact</th>
                                    <th>Items</th>
                                    <th className="text-end">Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>QR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="fw-semibold">#{order.id}</td>
                                            <td>{formatDate(order.order_date)}</td>
                                            <td>
                                                <div className="fw-semibold">{order.customer?.name || 'N/A'}</div>
                                                <small className="text-muted">{order.customer?.email || 'No email'}</small>
                                            </td>
                                            <td>{order.customer?.phone || 'N/A'}</td>
                                            <td>
                                                {order.items?.length ? (
                                                    <div>
                                                        <div className="fw-semibold">{order.items.length} items</div>
                                                        <small className="text-muted d-block">
                                                            {order.items
                                                                .slice(0, 2)
                                                                .map((item) => item.product?.name || 'N/A')
                                                                .join(', ')}
                                                        </small>
                                                        {order.items.length > 2 && (
                                                            <small className="text-muted">+{order.items.length - 2} more</small>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">No items</span>
                                                )}
                                            </td>
                                            <td className="text-end fw-semibold">৳ {formatMoney(order.total)}</td>
                                            <td>{order.payment_method || 'N/A'}</td>
                                            <td>
                                                <span
                                                    className={`badge text-uppercase ${
                                                        order.payment_status === 'completed'
                                                            ? 'bg-success'
                                                            : order.payment_status === 'pending'
                                                            ? 'bg-warning text-dark'
                                                            : 'bg-danger'
                                                    }`}
                                                >
                                                    {order.payment_status || 'unknown'}
                                                </span>
                                            </td>
                                            <td>
                                                {order.qr?.[0]?.token ? (
                                                    <span className="badge bg-info text-dark">{order.qr[0].status || 'valid'}</span>
                                                ) : (
                                                    <span className="text-muted">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center text-muted py-4">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
