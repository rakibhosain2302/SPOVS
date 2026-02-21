import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Dashboard from "./pages/auth/dashboard";
import OrderPage from "./pages/OrderPage";
import PaymentPage from "./pages/PaymentPage";
import InvoicePage from "./pages/InvoicePage";
import PrivateRoute from "./components/priviteRoute/privateRoute";

import { CartProvider } from "./context/CartContext";

const App = () => (
    <BrowserRouter>
        <CartProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/order"
                    element={
                        <PrivateRoute>
                            <OrderPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/payment/:method"
                    element={
                        <PrivateRoute>
                            <PaymentPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/payment/invoice"
                    element={
                        <PrivateRoute>
                            <InvoicePage />
                        </PrivateRoute>
                    }
                />
            </Routes>

            <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
            />
        </CartProvider>
    </BrowserRouter>
);

createRoot(document.getElementById("app")).render(<App />);
