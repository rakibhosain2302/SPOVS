import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { BsFillShieldLockFill, BsCreditCard2Front } from "react-icons/bs";
import { CiMobile2 } from "react-icons/ci";

const Checkout = () => {
    const navigate = useNavigate();
    const { totalAmount } = useCart();

    const [paymentMethod, setPaymentMethod] = useState("card");

    // Progress calculation (example max 100)
    const progress = totalAmount * 100;

    return (
        <div className="container mt-5">
            <div className="mx-auto" style={{ maxWidth: "550px", marginTop: "80px" }}>

                {/* Title */}
                <h3 className="fw-bold text-center">Checkout</h3>

                <div
                    className="gap-1 mb-3 d-flex justify-content-center align-items-center"
                    style={{ color: "#432dd7" }}
                >
                    <BsFillShieldLockFill />
                    <span className="fw-bold">Secure Transaction</span>
                </div>

                {/* Card */}
                <div className="card p-4 shadow rounded-4" style={{ backgroundColor: "#fff" }}>

                    {/* Amount */}
                    <div className="d-flex justify-content-between">
                        <p className="mb-1">Payable Amount</p>
                        <h4 className="fw-bold" style={{ color: "#432dd7" }}>
                            ${totalAmount}.00
                        </h4>
                    </div>

                    {/* Progress */}
                    <div className="progress mb-4" style={{ height: "8px" }}>
                        <div
                            className="progress-bar"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: "#432dd7",
                            }}
                        ></div>
                    </div>

                    <h6 className="fw-bold text-center mb-3">
                        Select Payment Method
                    </h6>

                    {/* Payment Options */}
                    <div className="d-flex flex-column gap-3">

                        {/* Card Payment */}
                        <div
                            onClick={() => setPaymentMethod("card")}
                            className="p-3 rounded-4 d-flex justify-content-between align-items-center"
                            style={{
                                border: "2px solid",
                                borderColor:
                                    paymentMethod === "card"
                                        ? "#432dd7"
                                        : "#ddd",
                                cursor: "pointer",
                            }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="p-2 rounded-3"
                                    style={{ backgroundColor: "#f1f1ff" }}
                                >
                                    <BsCreditCard2Front
                                        size={22}
                                        color="#432dd7"
                                    />
                                </div>

                                <div>
                                    <h6 className="mb-0 fw-bold">
                                        Credit / Debit Card
                                    </h6>
                                    <small className="text-muted">
                                        Pay via Visa, Master, Amex
                                    </small>
                                </div>
                            </div>

                            <input className="form-check-input"
                                type="radio"
                                checked={paymentMethod === "card"}
                                readOnly
                            />
                        </div>

                        {/* Mobile Banking */}
                        <div
                            onClick={() => setPaymentMethod("mobile")}
                            className="p-3 rounded-4 d-flex justify-content-between align-items-center"
                            style={{
                                border: "2px solid",
                                borderColor:
                                    paymentMethod === "mobile"
                                        ? "#432dd7"
                                        : "#ddd",
                                cursor: "pointer",
                            }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="p-2 rounded-3"
                                    style={{ backgroundColor: "#f1f1ff" }}
                                >
                                    <CiMobile2 size={22}
                                        color="#432dd7"
                                    />
                                </div>

                                <div>
                                    <h6 className="mb-0 fw-bold">
                                        Mobile Banking
                                    </h6>
                                    <small className="text-muted">
                                        Apple Pay, Google Pay
                                    </small>
                                </div>
                            </div>

                            <input className="form-check-input"
                                type="radio"
                                checked={paymentMethod === "mobile"}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Pay Button */}
                    <button
                        className="btn w-100 mt-4 py-3 text-white fw-bold"
                        style={{
                            background:
                                "linear-gradient(90deg,#432dd7,#5f4bff)",
                            borderRadius: "12px",
                        }}
                        onClick={() =>
                            navigate(`/payment/${paymentMethod}`)
                        }
                    >
                        Pay ${totalAmount}.00
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;