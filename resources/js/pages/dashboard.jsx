import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) return navigate("/login");

        api.get("/user", { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setUser(res.data))
            .catch((err) => {
                console.log("Dashboard API error:", err.response);
                localStorage.removeItem("auth_token");
                navigate("/login");
            });
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem("auth_token");
        await api.post(
            "/logout",
            {},
            { headers: { Authorization: `Bearer ${token}` } },
        );
        localStorage.removeItem("auth_token");
        toast.success("Logout Successful");
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    };

    return (
        <div className="container mt-5">
            <h2>Welcome, {user ? user.name : "User"}</h2>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}
