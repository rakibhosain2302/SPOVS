import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [lastInvoice, setLastInvoice] = useState(null);

    const addProduct = (product) => {
        const exist = cart.find((p) => p.id === product.id);
        if (exist) {
            setCart(
                cart.map((p) =>
                    p.id === product.id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p,
                ),
            );
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const increase = (id) => {
        setCart(
            cart.map((p) =>
                p.id === id ? { ...p, quantity: p.quantity + 1 } : p,
            ),
        );
    };

    const decrease = (id) => {
        setCart(
            cart
                .map((p) =>
                    p.id === id ? { ...p, quantity: p.quantity - 1 } : p,
                )
                .filter((p) => p.quantity > 0),
        );
    };

    const removeProduct = (id) => {
        setCart((prev) => prev.filter((p) => p.id !== id));
    };

    const totalAmount = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
    // provide a `total` alias for compatibility with components expecting `total`
    const total = totalAmount;

    // Called from the payment modal to navigate to the payment page
    const handlePayment = (method) => {
        if (!method) {
            toast.error("Please select a payment method");
            return;
        }

        if (cart.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        setPaymentMethod(method);
        navigate(`/payment/${method.toLowerCase()}`);
    };

    const finalizePayment = ({ meta } = {}) => {
        const invoice = {
            date: new Date().toISOString(),
            items: cart,
            total: totalAmount,
            status: "Paid",
            method: paymentMethod,
            meta: meta || null,
        };

        setLastInvoice(invoice);
        setIsPaid(true);
        setCart([]);
        toast.success("Payment successful");
    };

    return (
        <CartContext.Provider
            value={{ cart, addProduct, increase, decrease, removeProduct, totalAmount, total, handlePayment, paymentMethod, isPaid, finalizePayment, lastInvoice }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
