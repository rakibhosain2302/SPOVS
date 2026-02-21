import { useEffect, useState } from "react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const ProductSelector = () => {
    const [masters, setMasters] = useState([]);
    const [categories, setCategories] = useState([]);
    const [specs, setSpecs] = useState([]);
    const [selectedMaster, setSelectedMaster] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const { addProduct } = useCart();

    useEffect(() => {
        api.get("/master-products").then((res) => setMasters(res.data));
    }, []);

    const loadCategories = (id) => {
        setSelectedMaster(id);
        setCategories([]);
        setSpecs([]);
        setSelectedCategory("");
        if (id) {
            api.get(`/categories/${id}`).then((res) => setCategories(res.data));
        }
    };

    const loadSpecs = (id) => {
        setSelectedCategory(id);
        setSpecs([]);
        if (id) {
            api.get(`/specifications/${id}`).then((res) => setSpecs(res.data));
        }
    };

    return (
        <div className="card p-3 shadow-sm mb-4 rounded-4">
            <h5 className="fw-bold mb-3 text-primary">Select Product</h5>

            {/* Master Product Select */}
            <select
                className="form-select mb-3"
                value={selectedMaster}
                onChange={(e) => loadCategories(e.target.value)}
            >
                <option value="">-- Select Product --</option>
                {masters.map((m) => (
                    <option key={m.id} value={m.id}>
                        {m.name}
                    </option>
                ))}
            </select>

            {/* Category Select */}
            <select
                className="form-select mb-3"
                value={selectedCategory}
                onChange={(e) => loadSpecs(e.target.value)}
                disabled={!selectedMaster}
            >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>

            {/* Specifications */}
            <div className="mt-3">
                {specs.length === 0 && selectedCategory && (
                    <p className="text-muted">No specifications available</p>
                )}

                {specs.map((s) => (
                    <div
                        key={s.id}
                        className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded shadow-sm"
                    >
                        <div>
                            <span className="fw-semibold">{s.name}</span> -
                            <span className="text-success fw-bold">
                                {" "}
                                ৳ {s.price.price}
                            </span>
                        </div>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                                const master = masters.find((m) => m.id == selectedMaster);
                                const category = categories.find((c) => c.id == selectedCategory);

                                addProduct({
                                    id: s.id,
                                    name: master ? master.name : category ? category.name : s.name,
                                    masterId: selectedMaster,
                                    categoryId: selectedCategory,
                                    category: category ? category.name : "",
                                    specifications: s.name,
                                    price: s.price.price,
                                });
                            }}
                        >
                            Add
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductSelector;
