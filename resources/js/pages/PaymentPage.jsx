import React, { useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const PaymentPage = () => {
  const { method } = useParams();
  const navigate = useNavigate();
  const { totalAmount, placeOrder, products, customerInfo, paymentMethod } = useCart();

  const [selectedMobile, setSelectedMobile] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const handlePayment = async () => {
    try {
      // Validate guestInfo exists
      if (!customerInfo) {
        toast.error("Please fill customer details first");
        navigate("/customer-details");
        return;
      }

      const orderData = {
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        terms: true,

        payment_method: method === "mobile" ? selectedMobile : "card",

        // 🔥 এটা array হওয়া লাগবে (backend validation অনুযায়ী)
        payment_details: method === "mobile"
          ? { number: mobileNumber }
          : { card_number: cardNumber },

        items: products
          .filter(product => product.quantity > 0)
          .map(product => ({
            product_id: product.id,
            quantity: product.quantity,
            price: product.price,
          })),
      };

      // 🔥 await লাগবে
      const response = await api.post("/orders", orderData);

      toast.success("Payment Successfully");


      // Map server response to the shape our OrderConfirmation expects
      const respOrder = response.data.order || response.data;

      const mappedOrder = {
        id: respOrder.id,
        uuid: respOrder.uuid || "",
        date: respOrder.order_date || respOrder.created_at || null,
        guest: {
          name: respOrder.customer?.name || customerInfo?.name || "",
          email: respOrder.customer?.email || customerInfo?.email || "",
          phone: respOrder.customer?.phone || customerInfo?.phone || "",
        },
        tickets: (respOrder.items || orderData.items || []).map(item => ({
          id: item.product?.id || item.product_id || item.id,
          name: item.product?.name || item.name || item.title || "",
          quantity: item.quantity,
          price: Number(item.price),
        })),
        total: respOrder.total_amount || respOrder.total || totalAmount,
        qr: respOrder.qr || respOrder.qr_codes || [],
      };


  // store the order in context and clear cart/guest info via placeOrder
  placeOrder(mappedOrder);

  // Clear localStorage keys manually for extra safety
  localStorage.removeItem("products");
  localStorage.removeItem("customerInfo");
  localStorage.removeItem("paymentMethod");

  // Reload the page so all components re-mount and show fresh state
  // (this ensures going back doesn't show old data)
  const orderId = respOrder.id || mappedOrder.id;
  window.location.href = `/order-confirmation/${orderId}`;

    } catch (error) {
      console.error(error.response?.data);
      toast.error("Payment Failed");
    }
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