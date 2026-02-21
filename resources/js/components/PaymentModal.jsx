import { useState } from "react";
import { useCart } from "../context/CartContext";

const PaymentModal = () => {
  const { total, handlePayment } = useCart();
  const [method, setMethod] = useState("");

  const onPayNow = () => {
    const modalEl = document.getElementById("paymentModal");
    try {
      if (modalEl && window.bootstrap && window.bootstrap.Modal) {
        const inst = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
        inst.hide();
      } else {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
        document.body.classList.remove('modal-open');
      }
    } catch (e) {
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      document.body.classList.remove('modal-open');
    }

    setTimeout(() => handlePayment(method), 150);
  };

  return (
    <div className="modal fade" id="paymentModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow-lg border-0">

          {/* Header */}
          <div className="modal-header bg-success text-white rounded-top-4">
            <h5 className="modal-title fw-bold w-100 text-center">
              Checkout Payment
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">

            {/* Total Section */}
            <div className="text-center mb-4">
              <h6 className="text-muted">Total Amount</h6>
              <h3 className="fw-bold text-success">৳ {total}</h3>
            </div>

            {/* Payment Options */}
            <div className="d-grid gap-3">

              {/* bKash */}
              <div
                className={`border rounded-3 p-3 d-flex justify-content-between align-items-center 
                  ${method === "bKash" ? "border-success shadow-sm" : ""}`}
                onClick={() => setMethod("bKash")}
                style={{ cursor: "pointer" }}
              >
                <span className="fw-semibold">
                  <img src="/assets/images/paymentMethod/bKash.png" alt="bKash" style={{height:24, marginRight:8}} />
                  bKash
                </span>
                <input
                  type="radio"
                  checked={method === "bKash"}
                  readOnly
                />
              </div>

              {/* Nagad */}
              <div
                className={`border rounded-3 p-3 d-flex justify-content-between align-items-center 
                  ${method === "Nagad" ? "border-success shadow-sm" : ""}`}
                onClick={() => setMethod("Nagad")}
                style={{ cursor: "pointer" }}
              >
                <span className="fw-semibold">
                  <img src="/assets/images/paymentMethod/nagad.png" alt="Nagad" style={{height:24, marginRight:8}} />
                  Nagad
                </span>
                <input
                  type="radio"
                  checked={method === "Nagad"}
                  readOnly
                />
              </div>

              {/* Card */}
              <div
                className={`border rounded-3 p-3 d-flex justify-content-between align-items-center 
                  ${method === "Card" ? "border-success shadow-sm" : ""}`}
                onClick={() => setMethod("Card")}
                style={{ cursor: "pointer" }}
              >
                <span className="fw-semibold">
                  <img src="/assets/images/paymentMethod/card.png" alt="Card" style={{height:24, marginRight:8}} />
                  Debit / Credit Card
                </span>
                <input
                  type="radio"
                  checked={method === "Card"}
                  readOnly
                />
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 px-4 pb-4">
            <button
              className="btn btn-outline-secondary rounded-pill px-4"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>

            <button
              className="btn btn-success rounded-pill px-4"
              disabled={!method}
              onClick={onPayNow}
            >
              Pay Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentModal;