import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const PaymentPage = () => {
  const { method } = useParams();
  const navigate = useNavigate();
  const { totalAmount } = useCart();

  const [mobile, setMobile] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const handlePayment = () => {
    navigate("/order-confirmation");
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow rounded-4">
        <h4>Payment - ${totalAmount.toFixed(2)}</h4>

        {method === "mobile" && (
          <>
            <label className="fw-bold mt-3">Mobile Number</label>
            <input
              type="text"
              className="form-control"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </>
        )}

        {method === "card" && (
          <>
            <label className="fw-bold mt-3">Card Number</label>
            <input
              type="text"
              className="form-control"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </>
        )}

        <button
          className="btn btn-success w-100 mt-4"
          onClick={handlePayment}
          disabled={
            (method === "mobile" && mobile === "") ||
            (method === "card" && cardNumber === "")
          }
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;