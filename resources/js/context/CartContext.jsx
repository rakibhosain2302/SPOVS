// CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ---------------- State ----------------
  const [tickets, setTickets] = useState(() => {
    const stored = localStorage.getItem("tickets");
    return stored ? JSON.parse(stored) : [];
  });

  const [guestInfo, setGuestInfo] = useState(() => {
    const stored = localStorage.getItem("guestInfo");
    return stored ? JSON.parse(stored) : null;
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    return localStorage.getItem("paymentMethod") || "card";
  });

  const [order, setOrder] = useState(() => {
    const stored = localStorage.getItem("order");
    return stored ? JSON.parse(stored) : null;
  });

  // ---------------- LocalStorage Sync ----------------
  useEffect(() => localStorage.setItem("tickets", JSON.stringify(tickets)), [tickets]);
  useEffect(() => localStorage.setItem("guestInfo", JSON.stringify(guestInfo)), [guestInfo]);
  useEffect(() => localStorage.setItem("paymentMethod", paymentMethod), [paymentMethod]);
  useEffect(() => localStorage.setItem("order", JSON.stringify(order)), [order]);

  // ---------------- Total Amount ----------------
  const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.price * ticket.quantity, 0);

  // ---------------- Fetch Tickets ----------------
  const fetchTickets = async (forceReset = false) => {
    try {
      const response = await api.get("/tickets-list");
      setTickets(prevTickets => {
        return response.data.map(ticket => {
          const existing = prevTickets.find(prev => prev.id === ticket.id);
          return {
            ...ticket,
            // if forceReset is true, always start quantity at 0
            quantity: forceReset ? 0 : (existing ? existing.quantity : 0),
          };
        });
      });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets.");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ---------------- Save Guest Info ----------------
  const saveGuest = (guest) => {
    setGuestInfo(guest);
  };

  // ---------------- Place Order ----------------
  const placeOrder = (orderData) => {
    setOrder(orderData);

    setTickets([]);
    setGuestInfo(null);
    setPaymentMethod("card");

    try {
      localStorage.removeItem("tickets");
      localStorage.removeItem("guestInfo");
      localStorage.removeItem("paymentMethod");
    } catch (err) {
      toast.error("Failed to clear local storage.");
    }
    // refetch tickets to repopulate latest ticket info with zero quantities
    // so UI shows fresh data if user navigates back
    fetchTickets(true);
  };

  // ---------------- Context Value ----------------
  return (
    <CartContext.Provider
      value={{
        tickets,
        setTickets,
        guestInfo,
        setGuestInfo: saveGuest,
        totalAmount,
        paymentMethod,
        setPaymentMethod,
        order,
        placeOrder,
        fetchTickets
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);