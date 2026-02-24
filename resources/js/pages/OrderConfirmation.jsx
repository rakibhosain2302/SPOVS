import React from "react";
import { useCart } from "../context/CartContext";

const OrderConfirmation = () => {
  const { tickets, guestInfo, totalAmount } = useCart();

  return (
    <div className="container mt-5">
      <div className="card p-5 shadow rounded-4 text-center">
        <h2 className="text-success">Payment Successful 🎉</h2>

        <p className="mt-3">
          Thank you <strong>{guestInfo?.name}</strong>
        </p>

        <h5 className="mt-4">Order Details:</h5>

        {tickets.map((ticket) => (
          <p key={ticket.id}>
            {ticket.name} x {ticket.quantity}
          </p>
        ))}

        <h4 className="mt-3">Total: ${totalAmount}</h4>
      </div>
    </div>
  );
};

export default OrderConfirmation;