import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
            <div className="container">

                {/* Logo */}
                <NavLink className="navbar-brand fw-bold fs-4 text-uppercase" to="/">
                    <span className="text-primary">Product</span> System
                </NavLink>

                {/* Mobile Toggle */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Menu */}
                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav gap-lg-4 text-center">

                        <li className="nav-item">
                            <NavLink
                                to="/home"
                                className={({ isActive }) =>
                                    "nav-link fw-semibold px-3 rounded-pill transition " +
                                    (isActive ? "active text-primary bg-light" : "text-light")
                                }
                            >
                                Home
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="#"
                                className={({ isActive }) =>
                                    "nav-link fw-semibold px-3 rounded-pill transition " +
                                    (isActive ? "active text-primary bg-light" : "text-light")
                                }
                            >
                                Tickets
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="#"
                                className={({ isActive }) =>
                                    "nav-link fw-semibold px-3 rounded-pill transition " +
                                    (isActive ? "active text-primary bg-light" : "text-light")
                                }
                            >
                                About Us
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="#"
                                className={({ isActive }) =>
                                    "nav-link fw-semibold px-3 rounded-pill transition " +
                                    (isActive ? "active text-primary bg-light" : "text-light")
                                }
                            >
                                Contact Us
                            </NavLink>
                        </li>

                    </ul>
                </div>
                <div className="text-end">
                    <NavLink
                        to="#"
                        className={({ isActive }) =>
                            "nav-link fw-semibold p-2 rounded-pill transition " +
                            (isActive ? "active text-white bg-primary" : "text-light")
                        }
                    >
                        Buy Tickets
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;