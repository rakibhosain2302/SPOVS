import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function ProductBaseForm() {
    const [name, setName] = useState("");
    const [bases, setBases] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem("auth_token");

    // ✅ Fetch All Bases
    const fetchBases = async () => {
        try {
            const res = await api.get("/bases", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBases(res.data);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load bases!");
        }
    };

    useEffect(() => {
        fetchBases();
    }, []);

    // ✅ Create / Update
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
                    `/bases/${editingId}`,
                    { name },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Base updated successfully");
                setEditingId(null);
            } else {
                // Create
                await api.post(
                    "/bases",
                    { name },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Base created successfully");
            }

            setName("");
            fetchBases(); // Refresh list
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Something went wrong!"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ✅ Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await api.delete(`/bases/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Base deleted successfully");
            fetchBases();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Delete failed!");
        }
    };

    // ✅ Edit
    const handleEdit = (base) => {
        setName(base.name);
        setEditingId(base.id);
    };

    return (
        <>
            {/* 🔹 Create / Update Card */}
            <div className="card p-4 shadow-sm mb-4">
                <h5 className="mb-3">
                    {editingId ? "Edit Product Base" : "Create Product Base"}
                </h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            className="form-control"
                            placeholder="Product Base Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-success" disabled={submitting}>
                        {submitting
                            ? "Saving..."
                            : editingId
                                ? "Update"
                                : "Save"}
                    </button>
                </form>
            </div>

            {/* 🔹 Base List Card */}
            <div className="card p-4 shadow-sm">
                <h5 className="mb-3">Product Base List</h5>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th width="150">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bases.length > 0 ? (
                            bases.map((base, index) => (
                                <tr key={base.id}>
                                    <td>{index + 1}</td>
                                    <td>{base.name}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleEdit(base)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() =>
                                                handleDelete(base.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    No Data Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}