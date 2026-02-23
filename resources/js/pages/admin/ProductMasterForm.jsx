import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";



export default function SpecificationForm() {
    const [price, setPrice] = useState("");
    const [baseId, setBaseId] = useState("");
    const [bases, setBases] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [specificationId, setSpecificationId] = useState("");
    const [specifications, setSpecifications] = useState([]);
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem("auth_token");

    const basesfetch = async () => {
        const res = await api.get("/bases");
        setBases(res.data);
    };

    const categoriesfetch = async () => {
        const res = await api.get("/categories");
        setCategories(res.data);
    };

    const specificationsfetch = async () => {
        const res = await api.get("/specifications");
        setSpecifications(res.data);
    };

    const productsfetch = async () => {
        const res = await api.get("/master_products");
        setProducts(res.data);
    };

    useEffect(() => {
        basesfetch();
        categoriesfetch();
        specificationsfetch();
        productsfetch();
    }, []);

    // 🔥 Auto Generate Product Name
    const generateProductName = () => {
        const baseName = bases.find(b => b.id == baseId)?.name || "";
        const categoryName = categories.find(c => c.id == categoryId)?.name || "";
        const specificationName = specifications.find(s => s.id == specificationId)?.spec_name || "";

        return [baseName, categoryName, specificationName]
            .filter(Boolean)
            .join(" - ");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const productName = generateProductName();

        try {
            const payload = {
                name: productName,
                price,
                base_id: baseId,
                category_id: categoryId,
                specification_id: specificationId || null,
            };

            if (editingId) {
                await api.put(`/master_products/${editingId}`, payload);
                toast.success("Product updated successfully");
            } else {
                await api.post("/master_products", payload);
                toast.success("Product created successfully");
            }

            setPrice("");
            setBaseId("");
            setCategoryId("");
            setSpecificationId("");
            setEditingId(null);
            productsfetch();
        } catch (err) {
            if (err.response) {
                const { status, data } = err.response;
                console.error('API error', status, data);
                if (status === 422 && data.errors) {
                    const messages = Object.values(data.errors).flat().join(' ');
                    toast.error(messages || 'Validation failed');
                } else if (data.message) {
                    toast.error(data.message);
                } else {
                    toast.error('Operation failed!');
                }
            } else {
                console.error(err);
                toast.error('Network or unexpected error');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (id) => {
        const product = products.find(p => p.id === id);
        if (product) {
            setPrice(product.price);
            setBaseId(product.base_id);
            setCategoryId(product.category_id);
            setSpecificationId(product.specification_id || "");
            setEditingId(id);
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await api.delete(`/master_products/${id}`);
            toast.success("Product deleted successfully");
            productsfetch();
        } catch (err) {
            if (err.response) {
                const { status, data } = err.response;
                console.error('API error', status, data);
                if (data.message) {
                    toast.error(data.message);
                } else {
                    toast.error('Deletion failed!');
                }
            } else {
                console.error(err);
                toast.error('Network or unexpected error');
            }
        }
    }

    return (
        <>
            <div className="card p-4 shadow-sm">
                <h5>{editingId ? "Edit Product Master" : "Create Product Master"}</h5>

                <form onSubmit={handleSubmit}>

                    <select className="form-select mb-3"
                        value={baseId}
                        onChange={(e) => setBaseId(e.target.value)}
                        required>
                        <option value="">Select Base</option>
                        {bases.map(base => (
                            <option key={base.id} value={base.id}>{base.name}</option>
                        ))}
                    </select>

                    <select className="form-select mb-3"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required>
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>

                    <select className="form-select mb-3"
                        value={specificationId}
                        onChange={(e) => setSpecificationId(e.target.value)}>
                        <option value="">Select Specification</option>
                        {specifications.map(spec => (
                            <option key={spec.id} value={spec.id}>{spec.spec_name}</option>
                        ))}
                    </select>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Generated Product Name</label>
                        <input
                            className="form-control"
                            placeholder="Product Name will be generated based on selections"
                            value={generateProductName()}
                            readOnly
                        />
                    </div>

                    <input
                        type="number"
                        className="form-control mb-3"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter Price"
                        required
                    />

                    <button className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Saving..." : editingId ? "Update" : "Save"}
                    </button>
                </form>
            </div>

            <div className="card p-4 shadow-sm mt-3">
                <h5 className="card-header">Existing Product Masters</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product.id}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-success rounded" onClick={() => handleEdit(product.id)}><FaRegEdit size={18} /></button>
                                    <button className="btn btn-sm btn-outline-danger rounded" onClick={() => handleDelete(product.id)}><RiDeleteBin5Line size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    );
}