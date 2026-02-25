import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const GuestDetails = () => {
  const navigate = useNavigate();
  const { guestInfo, setGuestInfo } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    terms: false,
  });


  useEffect(() => {
    if (guestInfo) {
      setFormData(guestInfo);
    }
  }, [guestInfo]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const updatedFormData = {
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    };
    setFormData(updatedFormData);
    setGuestInfo(updatedFormData);
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.mobile.trim() !== "" &&
    formData.terms === true;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error(
        "Please fill in all required fields and accept the terms."
      );
      return;
    }

    navigate("/checkout");
  };


  return (
    <div className="container mt-4 mb-5">
      <div style={{ marginTop: "80px" }}>
        <h4 className="text-center fw-bold">Guest Details</h4>
        <p className="text-center text-muted">
          Fill in your information to receive your digital ticket.
        </p>

        <div className="d-flex justify-content-center">
          <div className="card p-4 w-50 shadow rounded-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Full Name</label>
                <input
                  type="text"
                  className="form-control p-3"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Mobile Number</label>
                <input
                  type="text"
                  className="form-control p-3"
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+8801000000000"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  className="form-control p-3"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  id="terms"
                  className="form-check-input"
                  checked={formData.terms}
                  onChange={handleChange}
                />
                <label className="form-check-label">
                  I agree to receive booking confirmations and promotional offers via SMS and Email.
                </label>
              </div>

              <button
                type="submit"
                className="btn w-100 p-3 fw-bold"
                style={{ background: "#323185", color: "#fff" }}
                disabled={!isFormValid}
              >
                Continue to Checkout
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDetails;