import React from 'react'
import NavBar from './layouts/NavBar'

const GuestDetails = () => {
    return (
        <>
            <div className='container mt-5'>
                <div style={{ marginTop: '80px' }}>
                    <h4 className='text-center guest-details-title'>Guest Details</h4>
                    <p className='text-center text-muted fw-medium mb-4'>Fill in your information to receive your digital ticket.</p>
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="card p-4 w-50 shadow rounded-4">
                            <form action="" className="mt-3 mb-3">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label fw-bold">Full Name</label>
                                    <input type="text" className="form-control p-3" id="name" placeholder="Enter your name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mobile" className="form-label fw-bold">Mobile Number</label>
                                    <input type="text" className="form-control p-3" id="mobile" placeholder="+8801000000000" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-bold">Email Address <span>(Optional)</span></label>
                                    <input type="email" className="form-control p-3" id="email" placeholder="you@example.com" />
                                </div>
                                <div className="mb-3 form-check checkbox-terms">
                                    <input type="checkbox" id="terms" className="form-check-input" />
                                    <label htmlFor="terms" className="form-check-label">I agree to receive booking confirmations and promotional offers via SMS and Email.</label>
                                </div>
                                <div className="w-75 mx-auto">
                                    <button type="submit" className="btn w-100 p-3 fw-bold" style={{ background: '#323185', color: '#fff', cursor: 'pointer' }} disabled>Proceed to Payment</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GuestDetails
