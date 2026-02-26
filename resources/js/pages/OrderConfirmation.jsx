import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const OrderConfirmation = () => {
  const { order: orderFromContext } = useCart();
  const { id } = useParams();

  const [order, setOrder] = useState(orderFromContext || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already have an order from context and it matches the id, skip fetch
    if (order && String(order.id) === String(id)) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/orders/${id}`);
        // API returns the order object directly
        const o = res.data;

        // Map API shape to UI-friendly shape used below
        const mapped = {
          id: o.id,
          date: o.order_date || o.created_at || null,
          guest: o.guest || { name: "", email: "", phone: "" },
          tickets: (o.items || []).map(item => ({
            id: item.product?.id || item.product_id || item.id,
            name: item.product?.name || item.name || item.product?.title || "",
            quantity: item.quantity,
            price: Number(item.price),
          })),
          total: o.total_amount || o.total || 0,
          qr: o.qr || [],
        };

        setOrder(mapped);
      } catch (err) {
        console.error('Failed to fetch order', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="container py-5">Loading order...</div>;
  if (error) return <div className="container py-5">Error: {String(error)}</div>;
  if (!order) return <div className="container py-5">No order found.</div>;


  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div id="order-confirmation-card" className="card border-0 shadow-lg rounded-4 overflow-hidden">

            {/* Header */}
            <div className="bg-success text-white text-center py-4 d-flex align-items-center justify-content-center px-4">
              <div>
                <h2 className="fw-bold mb-0">Payment Successful 🎉</h2>
                <small>Your booking has been confirmed</small>
              </div>
            </div>

            <div className="p-4">

              {/* Order Info */}
              <div className="d-flex justify-content-between mb-4">
                <div>
                  <h6 className="text-muted mb-1">Order ID</h6>
                  <strong>{order.qr && order.qr.length ? order.qr[0].token : order.id}</strong>
                </div>
                <div className="text-end">
                  <h6 className="text-muted mb-1">Date</h6>
                  <strong>{order.date ? new Date(order.date).toLocaleString() : ''}</strong>
                </div>
              </div>

              <hr />

              {/* Guest Info */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Guest Information</h5>
                <p className="mb-1"><strong>Name:</strong> {order.guest.name}</p>
                <p className="mb-1"><strong>Email:</strong> {order.guest.email}</p>
                <p className="mb-0"><strong>Phone:</strong> {order.guest.phone}</p>
              </div>

              <hr />

              {/* Ticket Summary */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Ticket Summary</h5>
                {order.tickets.map(t => (
                  <div key={t.id}>{t.name} x {t.quantity} <span>${(t.price * t.quantity).toFixed(2)}</span></div>
                ))}

                <div className="d-flex justify-content-between mt-3">
                  <h5>Total</h5>
                  <h5 className="text-success">${Number(order.total).toFixed(2)}</h5>
                </div>
              </div>

              <hr />

              {/* QR Code Section */}
              <div className="text-center mt-4">
                <h5 className="fw-bold mb-3">Your Entry QR Code</h5>

                <div className="bg-light p-3 d-inline-block rounded-4 shadow-sm">
                  <QRCode
                    value={order.qr && order.qr.length ? order.qr[0].token : JSON.stringify(order)}
                    size={150}
                  />
                </div>

                <p className="text-muted mt-3 mb-0">
                  Please show this QR code at entry for validation.
                </p>
              </div>

              <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-danger px-4 py-2 rounded-3 shadow-sm btn-sm me-2" onClick={() => window.location.href = '/tickets'}>
                  Back
                </button>
                <button
                  className="btn btn-success px-4 py-2 rounded-3 shadow-sm btn-sm"
                  onClick={async () => {
                    try {
                      const element = document.getElementById('order-confirmation-card');
                      if (!element) return;

                      // capture at higher scale for better quality
                      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
                      const imgData = canvas.toDataURL('image/png');

                      const pdf = new jsPDF('p', 'pt', 'a4');
                      const pdfWidth = pdf.internal.pageSize.getWidth();
                      const pdfHeight = pdf.internal.pageSize.getHeight();

                      const imgProps = {
                        width: canvas.width,
                        height: canvas.height,
                      };

                      const imgRatio = imgProps.width / imgProps.height;
                      const renderedImgHeight = pdfWidth / imgRatio;

                      let heightLeft = renderedImgHeight;
                      let position = 0;

                      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, renderedImgHeight);
                      heightLeft -= pdfHeight;

                      while (heightLeft > 0) {
                        position = heightLeft - renderedImgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, renderedImgHeight);
                        heightLeft -= pdfHeight;
                      }

                      pdf.save(`order-${order.id || 'confirmation'}.pdf`);
                    } catch (err) {
                      console.error('Failed to generate PDF', err);
                    }
                  }}
                >
                  Download PDF
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;