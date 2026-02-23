import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function CategoryForm() {
    const [name, setName] = useState("");
    const [baseId, setBaseId] = useState("");
    const [bases, setBases] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("auth_token");

    const basesfetch = async () => {
        try {
            const res = await api.get("/bases", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBases(res.data);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load bases!");
        }
    };

    const categoriesfetch = async () => {
        try {
            const res = await api.get("/categories", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(res.data);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load categories!");
        }
    }

    useEffect(() => {
        categoriesfetch();
        basesfetch();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!token) {
                toast.error("Not authenticated. Please login.");
                return;
            }
            if (editingId) {
                // Update
                await api.put(
                    `/categories/${editingId}`,
                    { name, base_id: baseId || null },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Category updated successfully");
                setName("");
                setBaseId("");
                setEditingId(null);
                categoriesfetch(); // Refresh list
            } else {
                // Create
                await api.post(
                    "/categories",
                    { name, base_id: baseId || null },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Category created successfully");
                setName("");
                setBaseId("");
                categoriesfetch(); // Refresh list
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create category!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Category deleted successfully");
            categoriesfetch(); // Refresh list
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete category!");
        }
    };

    const handleEdit = (category) => {
        setName(category.name);
        setBaseId(category.base_id || "");
        setEditingId(category.id);
    }

    return (
        <>
            <div className="py-4">
                <div className="card p-4 shadow-sm">
                    <h5 className="mb-3">{editingId ? "Edit Category" : "Create Category"}</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Select Base</label>
                            <select
                                className="form-select"
                                value={baseId}
                                onChange={(e) => setBaseId(e.target.value)}
                                required
                            >
                                <option value="">-- Select Base --</option>
                                {bases.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                className="form-control"
                                placeholder="Category Name"
                                value={name}
                                name="name"
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary" disabled={loading}>
                            {loading ? "Saving..." : editingId ? "Update" : "Save"}
                        </button>
                    </form>
                </div>
            </div>
            <div className="card p-4 shadow-sm">
                <h5 className="card-header">Category List</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Base Name</th>
                            <th>Category Name</th>
                            <th width="150">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <tr key={category.id}>
                                    <td>{index + 1}</td>
                                    <td>{category.base ? category.base.name : "N/A"}</td>
                                    <td>{category.name}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info me-2"
                                            onClick={() => handleEdit(category)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No categories found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
        </>
    );
}
