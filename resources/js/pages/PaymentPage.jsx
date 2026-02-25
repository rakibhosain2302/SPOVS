import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const PaymentPage = () => {
  const { method } = useParams();
  const navigate = useNavigate();
  const { totalAmount } = useCart();

  const [selectedMobile, setSelectedMobile] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const handlePayment = () => {
    navigate("/order-confirmation");
  };

  return (
    <div className="container mt-5">
      <div className="mx-auto" style={{ maxWidth: "550px" }}>
        <div className={`card p-4 shadow rounded-4 ${selectedMobile ? `dynamic-${selectedMobile}` : ""}`}>

          <h4 className="fw-bold border-bottom pb-3 text-center mb-4">
            Payment - ${totalAmount.toFixed(2)}
          </h4>

          {/* ================= MOBILE BANKING ================= */}
          {method === "mobile" && (
            <>
              <h6 className="fw-bold text-center mb-3">Select Mobile Banking</h6>

              <div className="method-btn d-flex w-75 mx-auto justify-content-between mb-3">

                <div
                  className={`btn ${selectedMobile === "bkash" ? "border-bkash" : "btn-outline-bkash"}`}
                  onClick={() => setSelectedMobile("bKash")}
                >
                  <img className="me-1" style={{ width: "20px" }} src="/assets/images/paymentMethod/bKash.png" alt="bKash" />
                  bKash
                </div>

                <div
                  className={`btn ${selectedMobile === "nagad" ? "border-nagad" : "btn-outline-nagad"}`}
                  onClick={() => setSelectedMobile("Nagad")}
                >
                  <img className="me-1" style={{ width: "20px" }} src="/assets/images/paymentMethod/nagad.png" alt="Nagad" />
                  Nagad
                </div>

                <div
                  className={`btn ${selectedMobile === "rocket" ? "border-rocket" : "btn-outline-rocket"}`}
                  onClick={() => setSelectedMobile("Rocket")}
                >
                  <img className="me-1" style={{ width: "20px" }} src="/assets/images/paymentMethod/roket.png" alt="Rocket" />
                  Rocket
                </div>

              </div>

              {/* Show input only if a mobile method selected */}
              {selectedMobile && (
                <>
                  <label className="fw-bold mt-2">
                    Enter {selectedMobile} Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </>
              )}
              <>
                <label className="fw-bold mt-2">
                  Payment Amount
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={totalAmount}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  disabled
                />
              </>
            </>
          )}

          {/* ================= CARD BANKING ================= */}
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

          {/* ================= PAY BUTTON ================= */}
          <button
            className={`btn w-100 mt-4 pay-btn ${selectedMobile === "bKash" ? "pay-btn-bKash" :
              selectedMobile === "Nagad" ? "pay-btn-Nagad" :
                selectedMobile === "Rocket" ? "pay-btn-Rocket" : "btn-primary"
              }`}
            onClick={handlePayment}
            disabled={
              (method === "mobile" && (!selectedMobile || mobileNumber === "")) ||
              (method === "card" && cardNumber === "")
            }
          >
            Pay Now
          </button>

        </div>
      </div>
    </div>
  );
};

export default PaymentPage;