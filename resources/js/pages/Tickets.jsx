import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import { useCart } from "../context/CartContext";


const ticketData = [
  { id: 1, name: "Standard Entry", price: 25 },
  { id: 2, name: "Unlimited Rides", price: 45 },
  { id: 3, name: "Child Special", price: 15 },
  { id: 4, name: "VIP Pass", price: 80 },
];

const Tickets = () => {
  const { setTickets: setCartTickets } = useCart();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [tickets, setTickets] = useState(
    ticketData.map((ticket) => ({ ...ticket, quantity: 0 }))
  );

  const handleIncrement = (id) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id && ticket.quantity < 10
          ? { ...ticket, quantity: ticket.quantity + 1 }
          : ticket
      )
    );
  };

  const handleDecrement = (id) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id && ticket.quantity > 0
          ? { ...ticket, quantity: ticket.quantity - 1 }
          : ticket
      )
    );
  };

  const totalAmount = tickets.reduce(
    (sum, ticket) => sum + ticket.quantity * ticket.price,
    0
  );


  const navigate = useNavigate();

  const handleContinue = () => {
    const selectedTickets = tickets.filter((ticket) => ticket.quantity > 0);
      setCartTickets(selectedTickets);
    if (selectedTickets.length === 0) {
      toast.error("Please select at least one ticket.");
      return;
    }
    navigate("/guest-details");
  }



  return (
    <>
      <div className="container mt-5">
        <div className="w-75 mx-auto">
          <div className="d-flex align-items-center mb-4">
            <IoIosArrowBack size={22} />
            <h3 className="ms-2 fw-bold">Select Your Tickets</h3>
          </div>

          <div className="row">
            <div className="col-md-8">

              {/* Date Card */}
              <div className="card p-4 shadow-sm rounded-4 mb-3">
                <h5 className="fw-semibold">Select Visit Date</h5>
                <div className="d-flex align-items-center border rounded-4 p-2 mt-2">
                  <CiCalendar size={22} />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="form-control border-0 shadow-none ms-2"
                  />
                </div>
              </div>

              {/* Ticket Cards */}
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="card p-4 shadow-sm rounded-4 mb-3"
                >
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <h6 className="fw-semibold mb-1">{ticket.name}</h6>
                      <small className="text-muted">
                        ${ticket.price}.00 / Person
                      </small>
                    </div>

                    <div className="col-lg-6 d-flex justify-content-lg-end mt-3 mt-lg-0">
                      <div className="d-flex align-items-center bg-light rounded-3 p-2">
                        <button
                          className="btn btn-sm rounded-3 decrement-btn"
                          onClick={() => handleDecrement(ticket.id)}
                          disabled={ticket.quantity === 0}
                        >
                          <FaMinus />
                        </button>

                        <span className="mx-3 fw-bold">
                          {ticket.quantity}
                        </span>

                        <button
                          className="btn btn-sm rounded-3 increment-btn"
                          onClick={() => handleIncrement(ticket.id)}
                          disabled={ticket.quantity === 10}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="col-md-4">
              <div
                className="card p-4 shadow-lg rounded-4"
                style={{
                  position: "sticky",
                  top: "20px",
                  backgroundColor: "#323185",
                }}
              >
                <h5 className="text-white fw-semibold border-bottom pb-2">
                  Order Summary
                </h5>

                {/* Date */}
                <div className="d-flex justify-content-between mt-3 border-bottom pb-2">
                  <span className="text-white">Date</span>
                  <span className="text-white fw-bold">{selectedDate}</span>
                </div>

                {/* Selected Tickets */}
                {tickets
                  .filter((ticket) => ticket.quantity > 0)
                  .map((ticket) => (
                    <div key={ticket.id} className="mt-3 border-bottom pb-2">
                      <div className="d-flex justify-content-between">
                        <span className="text-white" style={{ fontSize: "14px" }}>
                          {ticket.name} x{ticket.quantity}
                        </span>
                        <span className="text-white fw-bold" style={{ fontSize: "14px" }}>
                          ${(ticket.price * ticket.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}

                {/* Grand Total */}
                <div className="d-flex justify-content-between mt-3 pt-2">
                  <span className="text-white fw-bold fs-5">Total</span>
                  <span className="text-white fw-bold fs-5">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>

                <button
                  className="btn btn-light w-75 mx-auto mt-4 fw-bold"
                  style={{ color: "#323185", fontSize: "24px" }}
                  disabled={totalAmount === 0}
                  onClick={handleContinue}

                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tickets;