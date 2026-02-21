import ProductSelector from "../components/ProductSelector";
import ProductRow from "../components/ProductRow";
import { useCart } from "../context/CartContext";
import PaymentModal from "../components/PaymentModal";

const OrderPage = () => {
    const { cart } = useCart();

    const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Main Card */}
                    <div className="card shadow-lg border-0 rounded-4">
                        {/* Header */}
                        <div className="card-header bg-primary text-white text-center rounded-top-4">
                            <h3 className="fw-bold mb-0">🛒 Order Product</h3>
                        </div>

                        <div className="card-body p-4">
                            {/* Product Selection Section */}
                            <div className="mb-4">
                                <h5 className="fw-bold text-secondary mb-3">
                                    Select Product
                                </h5>
                                <div className="p-3 bg-light rounded-3 shadow-sm">
                                    <ProductSelector />
                                </div>
                            </div>

                            <hr />

                            {/* Selected Products */}
                            <div className="mt-4">
                                <h5 className="fw-bold text-secondary mb-3">
                                    Selected Products
                                </h5>

                                {cart.length === 0 ? (
                                    <div className="alert alert-warning text-center">
                                        No products selected
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-bordered align-middle text-center">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Category</th>
                                                    <th>Specifications</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Total</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cart.map((p) => (
                                                    <ProductRow
                                                        key={p.id}
                                                        product={p}
                                                    />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Total Section */}
                            {cart.length > 0 && (
                                <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded-3">
                                    <h4 className="fw-bold mb-0">
                                        Grand Total:
                                    </h4>
                                    <h4 className="fw-bold text-success mb-0">
                                        ৳ {total}
                                    </h4>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="text-end mt-4">
                                <button className="btn btn-success px-4 py-2 rounded-3 shadow" data-bs-toggle="modal" data-bs-target="#paymentModal" disabled={cart.length === 0}>
                                    Submit Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PaymentModal />
        </div>
    );
};

export default OrderPage;
