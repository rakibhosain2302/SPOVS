import React from "react";
import { useCart } from "../context/CartContext";
import QRCode from "react-qr-code";

const OrderConfirmation = () => {
  const { tickets, guestInfo, totalAmount } = useCart();

  const orderId = "ORD-" + Math.floor(Math.random() * 1000000);
  const orderDate = new Date().toLocaleString();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

            {/* Header */}
            <div className="bg-success text-white text-center py-4">
              <h2 className="fw-bold mb-0">Payment Successful 🎉</h2>
              <small>Your booking has been confirmed</small>
            </div>

            <div className="p-4">

              {/* Order Info */}
              <div className="d-flex justify-content-between mb-4">
                <div>
                  <h6 className="text-muted mb-1">Order ID</h6>
                  <strong>{orderId}</strong>
                </div>
                <div className="text-end">
                  <h6 className="text-muted mb-1">Date</h6>
                  <strong>{orderDate}</strong>
                </div>
              </div>

              <hr />

              {/* Guest Info */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Guest Information</h5>
                <p className="mb-1"><strong>Name:</strong> {guestInfo?.name}</p>
                <p className="mb-1"><strong>Email:</strong> {guestInfo?.email}</p>
                <p className="mb-0"><strong>Phone:</strong> {guestInfo?.phone}</p>
              </div>

              <hr />

              {/* Ticket Summary */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Ticket Summary</h5>

                {tickets
                  .filter(ticket => ticket.quantity > 0)
                  .map(ticket => (
                    <div
                      key={ticket.id}
                      className="d-flex justify-content-between border-bottom py-2"
                    >
                      <span>{ticket.name} × {ticket.quantity}</span>
                      <span>${ticket.price * ticket.quantity}</span>
                    </div>
                  ))}

                <div className="d-flex justify-content-between mt-3">
                  <h5>Total</h5>
                  <h5 className="text-success">${totalAmount}</h5>
                </div>
              </div>

              <hr />

              {/* QR Code Section */}
              <div className="text-center mt-4">
                <h5 className="fw-bold mb-3">Your Entry QR Code</h5>

                <div className="bg-light p-3 d-inline-block rounded-4 shadow-sm">
                  <QRCode
                    value={JSON.stringify({
                      orderId,
                      name: guestInfo?.name,
                      total: totalAmount
                    })}
                    size={150}
                  />
                </div>

                <p className="text-muted mt-3 mb-0">
                  Please show this QR code at entry for validation.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;