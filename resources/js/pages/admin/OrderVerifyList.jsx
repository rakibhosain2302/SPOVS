import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, Tab, Button, Table, Modal, Form, Toast, Container, Row, Col } from 'react-bootstrap';

export default function OrderVerifyList() {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVerify, setSelectedVerify] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [formData, setFormData] = useState({
        order_id: '',
        item_id: '',
        item_quantity: '',
        item_price: '',
        item_name: '',
        item_verifier_by: '',
        item_verified_at: '',
        purchased_at: '',
    });

    // Fetch verifications list
    useEffect(() => {
        fetchVerifications();
    }, []);

    const fetchVerifications = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/order-item-verify');
            setVerifications(response.data.data);
        } catch (error) {
            console.error('Error fetching verifications:', error);
            showNotification('Failed to load verifications', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    // Handle Edit
    const handleEdit = (verify) => {
        setSelectedVerify(verify);
        setFormData({
            order_id: verify.order_id,
            item_id: verify.item_id,
            item_quantity: verify.item_quantity,
            item_price: verify.item_price,
            item_name: verify.item_name,
            item_verifier_by: verify.item_verifier_by || '',
            item_verified_at: verify.item_verified_at ? verify.item_verified_at.split(' ')[0] : '',
            purchased_at: verify.purchased_at ? verify.purchased_at.split(' ')[0] : '',
        });
        setShowEditModal(true);
    };

    // Handle Edit Form Change
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle Update
    const handleUpdate = async () => {
        try {
            await axios.put(`/api/order-item-verify/${selectedVerify.id}`, formData);
            showNotification('Verification updated successfully', 'success');
            setShowEditModal(false);
            fetchVerifications();
        } catch (error) {
            console.error('Error updating verification:', error);
            showNotification('Failed to update verification', 'danger');
        }
    };

    // Handle Delete
    const handleDelete = (verify) => {
        setSelectedVerify(verify);
        setShowDeleteModal(true);
    };

    // Confirm Delete
    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/order-item-verify/${selectedVerify.id}`);
            showNotification('Verification deleted successfully', 'success');
            setShowDeleteModal(false);
            fetchVerifications();
        } catch (error) {
            console.error('Error deleting verification:', error);
            showNotification('Failed to delete verification', 'danger');
        }
    };

    return (
        <div className="mt-1">
            <h2 className='mb-4'>Order Verification List</h2>
            {/* Toast Notification */}
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    minWidth: '300px',
                }}
            >
                <Toast.Header closeButton bg={toastType}>
                    <strong className="me-auto">{toastType === 'success' ? 'Success' : 'Error'}</strong>
                </Toast.Header>
                <Toast.Body className={toastType === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}>
                    {toastMessage}
                </Toast.Body>
            </Toast>

            {/* Verifications Table */}
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead className="table-dark">
                            <tr>
                                <th>#ID</th>
                                <th>Order ID</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Verified By</th>
                                <th>Verified At</th>
                                <th>Purchased At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {verifications.length > 0 ? (
                                verifications.map((verify) => (
                                    <tr key={verify.id}>
                                        <td>{verify.id}</td>
                                        <td>{verify.order_id}</td>
                                        <td>{verify.item_name}</td>
                                        <td>{verify.item_quantity}</td>
                                        <td>৳{parseFloat(verify.item_price).toFixed(2)}</td>
                                        <td>{verify.item_verifier_by || 'N/A'}</td>
                                        <td>{new Date(verify.item_verified_at).toLocaleDateString()}</td>
                                        <td>{new Date(verify.purchased_at).toLocaleDateString()}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="warning"
                                                onClick={() => handleEdit(verify)}
                                                className="me-2"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => handleDelete(verify)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        No verifications found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Verification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Order ID</Form.Label>
                            <Form.Control
                                type="number"
                                name="order_id"
                                value={formData.order_id}
                                onChange={handleFormChange}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Item ID</Form.Label>
                            <Form.Control
                                type="number"
                                name="item_id"
                                value={formData.item_id}
                                onChange={handleFormChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="item_name"
                                value={formData.item_name}
                                onChange={handleFormChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                name="item_quantity"
                                value={formData.item_quantity}
                                onChange={handleFormChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="item_price"
                                value={formData.item_price}
                                onChange={handleFormChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Verified By</Form.Label>
                            <Form.Control
                                type="text"
                                name="item_verifier_by"
                                value={formData.item_verifier_by}
                                onChange={handleFormChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Verified At</Form.Label>
                            <Form.Control
                                type="date"
                                name="item_verified_at"
                                value={formData.item_verified_at}
                                onChange={handleFormChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Purchased At</Form.Label>
                            <Form.Control
                                type="date"
                                name="purchased_at"
                                value={formData.purchased_at}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Verification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this verification record?</p>
                    <p className="text-muted">
                        <strong>Item:</strong> {selectedVerify?.item_name}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
