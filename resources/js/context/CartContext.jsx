// CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const defaultTickets = [
  { id: 1, name: "Standard Entry", price: 25, quantity: 0 },
  { id: 2, name: "Unlimited Rides", price: 45, quantity: 0 },
  { id: 3, name: "Child Special", price: 15, quantity: 0 },
  { id: 4, name: "VIP Pass", price: 80, quantity: 0 },
];

export const CartProvider = ({ children }) => {
  const [tickets, setTickets] = useState(() => {
    const stored = localStorage.getItem("tickets");
    return stored ? JSON.parse(stored) : defaultTickets;
  });

  const [guestInfo, setGuestInfo] = useState(() => {
    const stored = localStorage.getItem("guestInfo");
    return stored ? JSON.parse(stored) : null;
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    return localStorage.getItem("paymentMethod") || "card";
  });


  // Save to localStorage
  useEffect(() => localStorage.setItem("tickets", JSON.stringify(tickets)), [tickets]);
  useEffect(() => localStorage.setItem("guestInfo", JSON.stringify(guestInfo)), [guestInfo]);
  useEffect(() => localStorage.setItem("paymentMethod", paymentMethod), [paymentMethod]);

  const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.price * ticket.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        tickets,
        setTickets,
        guestInfo,
        setGuestInfo,
        totalAmount,
        paymentMethod,
        setPaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);