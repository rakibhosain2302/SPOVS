// CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ---------------- State ----------------
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : [];
  });

  const [customerInfo, setCustomerInfo] = useState(() => {
    const stored = localStorage.getItem("customerInfo");
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
  useEffect(() => localStorage.setItem("products", JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem("customerInfo", JSON.stringify(customerInfo)), [customerInfo]);
  useEffect(() => localStorage.setItem("paymentMethod", paymentMethod), [paymentMethod]);
  useEffect(() => localStorage.setItem("order", JSON.stringify(order)), [order]);

  // ---------------- Total Amount ----------------
  const totalAmount = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

  // ---------------- Fetch Products ----------------
  const fetchProducts = async (forceReset = false) => {
    try {
      const response = await api.get("/products-list");
      setProducts(prevProducts => {
        return response.data.map(product => {
          const existing = prevProducts.find(prev => prev.id === product.id);
          return {
            ...product,
            // if forceReset is true, always start quantity at 0
            quantity: forceReset ? 0 : (existing ? existing.quantity : 0),
          };
        });
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------- Save Guest Info ----------------
  const saveGuest = (customer) => {
    setCustomerInfo(customer);
  };

  // ---------------- Place Order ----------------
  const placeOrder = (orderData) => {
    setOrder(orderData);

    setProducts([]);
    setCustomerInfo(null);
    setPaymentMethod("card");

    try {
      localStorage.removeItem("products");
      localStorage.removeItem("customerInfo");
      localStorage.removeItem("paymentMethod");
    } catch (err) {
      toast.error("Failed to clear local storage.");
    }
    // refetch products to repopulate latest product info with zero quantities
    // so UI shows fresh data if user navigates back
    fetchProducts(true);
  };

  // ---------------- Context Value ----------------
  return (
    <CartContext.Provider
      value={{
        products,
        setProducts,
        customerInfo,
        setCustomerInfo : saveGuest,
        totalAmount,
        paymentMethod,
        setPaymentMethod,
        order,
        placeOrder,
        fetchProducts
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);