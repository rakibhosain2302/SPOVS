import React from "react";
import { useCart } from "../context/CartContext";

const InvoicePage = () => {
  const { lastInvoice } = useCart();

  if (!lastInvoice) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">No invoice available.</div>
      </div>
    );
  }

  const { date, items, total, status, method } = lastInvoice;

  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4 rounded-4">
        <h3 className="text-center fw-bold mb-4">Invoice</h3>

        <div className="mb-3">
          <strong>Date:</strong> {new Date(date).toLocaleString()}
        </div>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.name || it.title || it.product_name || `Product ${it.id}`}</td>
                  <td>{it.quantity}</td>
                  <td>৳ {it.price * it.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <strong>Status:</strong> <span className="text-success">{status}</span>
          </div>
          <div>
            <strong>Total:</strong> <span className="fw-bold">৳ {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
