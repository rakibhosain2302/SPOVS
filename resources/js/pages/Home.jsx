import React from 'react'
import NavBar from './NavBar'

const Home = () => {
    return (
        <>
            <NavBar />
            <div className='container mt-5'>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Welcome to Our Product System</h5>
                        <p className="card-text">Explore our wide range of products and enjoy seamless shopping experience.</p>
                        <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
                    </div>
                </div>
                <h1>Welcome to the Home Page</h1>
            </div>
        </>
    )
}

export default Home
