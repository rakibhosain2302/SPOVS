import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function SpecificationForm() {
    const [name, setName] = useState("");
    const [baseId, setBaseId] = useState("");
    const [bases, setBases] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [specifications, setSpecifications] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem("auth_token");

    const basesfetch = async () => {
        try {
            const res = await api.get("/bases");
            setBases(res.data);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load bases!");
        }
    };

    const categoriesfetch = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load specifications!");
        }
    }

    const specificationsfetch = async () => {
        try {
            const res = await api.get("/specifications");
            setSpecifications(res.data);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load specifications!");
        }
    };

    useEffect(() => {
        basesfetch();
        categoriesfetch();
        specificationsfetch();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (!token) {
                toast.error("Not authenticated. Please login.");
                return;
            }
            if (editingId) {
                // Update
                await api.put(
                    `/specifications/${editingId}`,
                    { spec_name: name, base_id: baseId, category_id: categoryId || null },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                toast.success("Specification updated successfully");
                setName("");
                setBaseId("");
                setCategoryId("");
                setEditingId(null);
                specificationsfetch(); // Refresh list
            } else {
                // Create
                await api.post(
                    "/specifications",
                    { spec_name: name, base_id: baseId, category_id: categoryId || null },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Specification created successfully");
                setName("");
                setBaseId("");
                setCategoryId("");
                setEditingId(null);
                specificationsfetch(); // Refresh list
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create specification");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/specifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Specification deleted successfully");
            specificationsfetch();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete specification!");
        }
    };

    const handleEdit = (specification) => {
        setName(specification.spec_name);
        setBaseId(specification.base_id || "");
        setCategoryId(specification.category_id || "");
        setEditingId(specification.id);
    };

    return (
        <>
            <div className="py-4">
                <div className="card p-4 shadow-sm">
                    <h5 className="mb-3">{editingId ? "Edit Specification" : "Create Specification"}</h5>
                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <select
                                className="form-select"
                                value={baseId}
                                onChange={(e) => setBaseId(e.target.value)}
                            >
                                <option value="">-- Select Base --</option>
                                {bases.map((base) => (
                                    <option key={base.id} value={base.id}>{base.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <select
                                className="form-select"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}>
                                <option value="">-- Select Category --</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Specification Name"
                                required
                            />
                        </div>


                        <button className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Saving..." : editingId ? "Update" :
                            'Save'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="card p-4 shadow-sm">
                <h5 className="mb-3">Specification List</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Base-Name</th>
                            <th>Category-Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specifications.map((spec, index) => (
                            <tr key={spec.id}>
                                <td>{index + 1}</td>
                                <td>{spec.spec_name}</td>
                                <td>{spec.base?.name || "N/A"}</td>
                                <td>{spec.category?.name || "N/A"}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEdit(spec)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(spec.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
