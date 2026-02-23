import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../api/axios";
import { toast } from "react-toastify";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/login", { email, password });
            localStorage.setItem("auth_token", res.data.access_token);
            toast.success("Login Successfully");
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Login Failed! Please try again.";
            toast.error(message);
            setError(message);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <div className="card p-4">
                <h2 className="text-center mb-4">Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn btn-primary">Login</button>
                </form>
                <p className="mt-2">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}
