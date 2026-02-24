import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className='bg-dark text-light py-3 mt-4'>
            <div className='container'>
                <div className="row">
                    <div className="col-md-6">
                        <div className="footer-logo mt-5">
                            <span className="text-primary fw-bold fs-5">Product</span> <span className='fw-bold'>System</span>
                        </div>
                        <p className='text-justify mt-3 w-75'>The ultimate amusement park management system. Providing seamless experiences for both guests and operators through innovation.</p>
                        <div className="d-flex justify-between align-items-center mt-3 mb-3">
                            <a href="#" className="text-light bg-light border p-2 rounded-circle me-3"><FaFacebook size={20} color="#3b5998" /></a>
                            <a href="#" className="text-light bg-light border p-2 rounded-circle me-3"><FaTwitter size={20} color="#1da1f2" /></a>
                            <a href="#" className="text-light bg-light border p-2 rounded-circle me-3"><FaInstagram size={20} color="#c32aa3" /></a>
                            <a href="#" className="text-light bg-light border p-2 rounded-circle"><FaLinkedin size={20} color="#0077b5" /></a>
                        </div>
                    </div>
                    <div className="col-md-3 mt-5">
                        <div className="footer-links">
                            <h5 className="mb-3 fw-bold text-light">System Links</h5>
                            <ul className="list-unstyled mt-3">
                                <li className='mb-2'><a href="#" className="text-light fw-normal text-decoration-none">Admin Panel</a></li>
                                <li className='mb-2'><a href="#" className="text-light fw-normal text-decoration-none">Staff Login</a></li>
                                <li className='mb-2'><a href="#" className="text-light fw-normal text-decoration-none">API Documentation</a></li>
                                <li className='mb-2'><a href="#" className="text-light fw-normal text-decoration-none">Terms & Conditions</a></li>
                                <li><a href="#" className="text-light fw-normal text-decoration-none">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-3 mt-5">
                        <div className="footer-links">
                            <h5 className="mb-3 fw-bold text-light">Contact Us</h5>
                            <ul className="list-unstyled mt-3">
                                <li className='mb-2'><a href="#" className="text-light fw-normal text-decoration-none">Email</a></li>
                                <li className='mb-2'><a href="#" className="text-light fw-normal text-decoration-none">Phone</a></li>
                                <li className='mb-2'><a href="#" className="text-light fw-normal text-decoration-none">Support</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-4 border-zinc-500 border-top pt-3">
                    <p className="mb-0">&copy; {year} Product System. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
