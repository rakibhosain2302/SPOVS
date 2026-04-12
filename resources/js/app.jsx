import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "../css/app.css";

import NavBar from "./pages/layouts/NavBar";
import Footer from "./pages/layouts/Footer";
import Login from "./pages/admin/auth/login";
import Register from "./pages/admin/auth/register";
import Dashboard from "./pages/admin/auth/dashboard";
import ProductBaseForm from "./pages/admin/ProductBaseForm";
import CategoryForm from "./pages/admin/CategoryForm";
import SpecificationForm from "./pages/admin/SpecificationForm";
import ProductMasterForm from "./pages/admin/ProductMasterForm";
import AdminLayout from "./pages/admin/AdminLayout";
import OrderPage from "./pages/OrderPage";
import PaymentPage from "./pages/PaymentPage";
import InvoicePage from "./pages/InvoicePage";
import PrivateRoute from "./components/priviteRoute/privateRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CustomerDetails from "./pages/CustomerDetails";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderVerify from "./pages/admin/OrderVerify";

import { CartProvider } from "./context/CartContext";

// Admin route গুলোতে Footer/NavBar দেখাবে না
const noLayoutRoutes = ["/login", "/register", "/admin", "/order", "/payment"];

const Layout = ({ children }) => {
    const location = useLocation();
    const hideLayout = noLayoutRoutes.some(path => location.pathname.startsWith(path));

    return (
        <>
            {!hideLayout && <NavBar />}
            {children}
            {!hideLayout && <Footer />}
        </>
    );
};

const App = () => (
    <BrowserRouter>
        <CartProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/customer-details" element={<CustomerDetails />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />

                    {/* Admin Panel Routes */}
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute>
                                <AdminLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="product-base" element={<ProductBaseForm />} />
                        <Route path="category" element={<CategoryForm />} />
                        <Route path="specification" element={<SpecificationForm />} />
                        <Route path="master" element={<ProductMasterForm />} />
                        <Route path="order-verify" element={<OrderVerify />} />
                    </Route>

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
            </Layout>

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