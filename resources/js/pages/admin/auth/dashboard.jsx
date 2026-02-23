import React, { useEffect, useState } from "react";

export default function Dashboard() {
    return (
        <div>
            <div className="row g-4">

                <div className="col-md-4">
                    <div className="card border-0 shadow rounded-4 p-4">
                        <h6 className="text-muted mb-2">Total Orders</h6>
                        <h3 className="fw-bold mb-0">120</h3>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow rounded-4 p-4">
                        <h6 className="text-muted mb-2">Total Products</h6>
                        <h3 className="fw-bold mb-0">45</h3>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow rounded-4 p-4">
                        <h6 className="text-muted mb-2">Revenue</h6>
                        <h3 className="fw-bold text-success mb-0">৳ 85,000</h3>
                    </div>
                </div>

            </div>
        </div>
    );
}