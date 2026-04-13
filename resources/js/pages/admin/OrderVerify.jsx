import React, { useRef, useState, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import axios from 'axios';

const OrderVerify = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animRef = useRef(null);

    const [scanning, setScanning] = useState(false);
    const [scannedToken, setScannedToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedQty, setSelectedQty] = useState(0);
    const [issuing, setIssuing] = useState(false);
    const [manualId, setManualId] = useState('');
    const [history, setHistory] = useState([]);
    const [lineY, setLineY] = useState(0);
    const [toast, setToast] = useState(null);

    // Animate scan line
    useEffect(() => {
        if (!scanning) return;
        let y = 0, dir = 1;
        const interval = setInterval(() => {
            y += dir * 2;
            if (y >= 100) dir = -1;
            if (y <= 0) dir = 1;
            setLineY(y);
        }, 16);
        return () => clearInterval(interval);
    }, [scanning]);

    // Auto-hide toast
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const stopScan = useCallback(() => {
        setScanning(false);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (animRef.current) cancelAnimationFrame(animRef.current);
    }, []);

    const verifyTicket = useCallback(async (ticketId) => {
        if (!ticketId.trim()) return;
        setLoading(true);
        setOrderData(null);
        try {
            const res = await axios.get(`/api/verify-ticket/${encodeURIComponent(ticketId.trim())}`);
            setOrderData(res.data);
            setSelectedQty(0);
            setModalOpen(true);
        } catch (err) {
            const errData = err.response?.data;
            setOrderData({
                status: 'invalid',
                message: errData?.message || 'Order not found.',
            });
            setModalOpen(true);
            addHistory(ticketId, 'invalid', null);
        } finally {
            setLoading(false);
        }
    }, []);

    const scanFrame = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imgData.data, imgData.width, imgData.height, {
                inversionAttempts: 'dontInvert',
            });
            if (code) {
                stopScan();
                setScannedToken(code.data);
                return;
            }
        }
        animRef.current = requestAnimationFrame(scanFrame);
    }, [stopScan]);

    const startScan = async () => {
        setOrderData(null);
        setScannedToken(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
            });
            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            videoRef.current.setAttribute('playsinline', true);
            await videoRef.current.play();
            setScanning(true);
            animRef.current = requestAnimationFrame(scanFrame);
        } catch {
            setToast({ type: 'error', msg: 'Camera access denied or not available.' });
        }
    };

    const handleVerifyClick = () => {
        if (scannedToken) verifyTicket(scannedToken);
    };

    const handleManualVerify = () => {
        if (!manualId.trim()) return;
        setScannedToken(manualId.trim());
        verifyTicket(manualId.trim());
        setManualId('');
    };

    const handleManualKeyDown = (e) => {
        if (e.key === 'Enter') handleManualVerify();
    };

    const addHistory = (id, status, name) => {
        setHistory(prev => [
            { id, status, name, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) },
            ...prev.slice(0, 9),
        ]);
    };

    const issueProduct = async () => {
        if (!orderData || issuing) return;
        setIssuing(true);
        try {
            const now = new Date().toISOString();
            const payload = {
                order_id: orderData.order_id,
                item_id: orderData.item_id,
                item_quantity: selectedQty,
                item_price: orderData.item_price,
                item_name: orderData.item_name,
                item_verifier_by: orderData.verifier_by ?? 'staff',
                item_verify_at: now,
                purcess_at: orderData.purcess_at ?? now,
                updated_at: now,
            };
            await axios.post('/api/order-item-verify', payload);
            addHistory(scannedToken, 'valid', orderData.name);
            setToast({ type: 'success', msg: `Issued ${selectedQty} unit${selectedQty > 1 ? 's' : ''} of ${orderData.item_name}` });
            setModalOpen(false);
            setScannedToken(null);
            setOrderData(null);
        } catch (err) {
            setToast({ type: 'error', msg: err.response?.data?.message || 'Failed to issue product.' });
        } finally {
            setIssuing(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const resetAll = () => {
        stopScan();
        setScannedToken(null);
        setOrderData(null);
        setModalOpen(false);
        setSelectedQty(0);
    };

    useEffect(() => () => stopScan(), [stopScan]);

    const statusConfig = {
        valid: { label: 'Valid order', cls: 'success' },
        used: { label: 'Already used', cls: 'warning' },
        invalid: { label: 'Invalid order', cls: 'danger' },
    };

    const remaining = orderData?.remaining ?? 0;

    return (
        <div className="container py-4" style={{ maxWidth: 480 }}>

            {/* Header */}
            <div className="mb-3">
                <h4 className="fw-bold mb-1">QR Ticket Scanner</h4>
                <p className="text-muted small mb-0">Scan a QR code or enter ticket ID to verify</p>
            </div>

            {/* Camera Box */}
            <div className="border rounded-3 overflow-hidden mb-3 bg-dark">
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <video
                        ref={videoRef}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: scanning ? 'block' : 'none' }}
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    {/* Scanner overlay */}
                    {scanning && (
                        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
                            <path d="M0,0 H100 V100 H0 Z M20,20 H80 V80 H20 Z" fill="rgba(0,0,0,0.45)" fillRule="evenodd" />
                            <polyline points="20,32 20,20 32,20" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                            <polyline points="68,20 80,20 80,32" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                            <polyline points="20,68 20,80 32,80" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                            <polyline points="68,80 80,80 80,68" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                            <rect x="22" y={20 + (lineY / 100) * 60} width="56" height="1.5" fill="rgba(74,222,128,0.7)" rx="1" />
                        </svg>
                    )}

                    {/* Placeholder */}
                    {!scanning && (
                        <div className="text-center">
                            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
                                <rect x="3" y="3" width="20" height="20" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
                                <rect x="8" y="8" width="8" height="8" fill="rgba(255,255,255,0.4)" rx="1" />
                                <rect x="33" y="3" width="20" height="20" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
                                <rect x="38" y="8" width="8" height="8" fill="rgba(255,255,255,0.4)" rx="1" />
                                <rect x="3" y="33" width="20" height="20" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
                                <rect x="8" y="38" width="8" height="8" fill="rgba(255,255,255,0.4)" rx="1" />
                                <rect x="33" y="33" width="5" height="5" fill="rgba(255,255,255,0.4)" rx="1" />
                                <rect x="41" y="33" width="5" height="5" fill="rgba(255,255,255,0.4)" rx="1" />
                                <rect x="49" y="33" width="5" height="5" fill="rgba(255,255,255,0.4)" rx="1" />
                                <rect x="33" y="41" width="5" height="5" fill="rgba(255,255,255,0.4)" rx="1" />
                                <rect x="41" y="41" width="5" height="5" fill="rgba(255,255,255,0.4)" rx="1" />
                                <rect x="49" y="49" width="5" height="5" fill="rgba(255,255,255,0.4)" rx="1" />
                            </svg>
                            <p className="text-white-50 small mb-0">Camera inactive</p>
                        </div>
                    )}

                    {/* Scanned result bar with Verify button */}
                    {scannedToken && !modalOpen && (

                        <div className="bg-white border-top p-3" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted mb-0" style={{ fontSize: 11 }}>Scanned</p>
                                    <p className="fw-bold small mb-0">{scannedToken}</p>
                                </div>
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={handleVerifyClick}
                                    disabled={loading}
                                >
                                    {loading
                                        ? <span className="spinner-border spinner-border-sm" />
                                        : 'Verify'
                                    }
                                </button>
                            </div>
                        </div>

                        
                    )}

                </div>
            </div>

            {/* Buttons */}
            <div className="d-flex gap-2 mb-3">
                {!scanning ? (
                    <button className="btn btn-primary flex-fill" onClick={startScan}>Start scanning</button>
                ) : (
                    <button className="btn btn-secondary flex-fill" onClick={stopScan}>Stop camera</button>
                )}
                <button className="btn btn-outline-secondary flex-fill" onClick={resetAll}>Reset</button>
            </div>

            {/* Manual Entry */}
            {/* <div className="bg-light rounded-3 p-3 mb-3">
                <p className="small fw-bold text-muted mb-2">Manual entry</p>
                <div className="input-group input-group-sm">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter QR token"
                        value={manualId}
                        onChange={e => setManualId(e.target.value)}
                        onKeyDown={handleManualKeyDown}
                    />
                    <button className="btn btn-primary" onClick={handleManualVerify} disabled={loading}>
                        Verify
                    </button>
                </div>
            </div> */}

            {/* Scan History */}
            {history.length > 0 && (
                <div>
                    <p className="small fw-bold text-muted mb-2">Recent scans</p>
                    <div className="d-flex flex-column gap-1">
                        {history.map((h, i) => (
                            <div key={i} className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded border">
                                <span className="small fw-bold">{h.id}</span>
                                <div className="d-flex align-items-center gap-2">
                                    <span className={`badge bg-${statusConfig[h.status]?.cls}`} style={{ fontSize: 11 }}>
                                        {statusConfig[h.status]?.label}
                                    </span>
                                    <span className="text-muted" style={{ fontSize: 11 }}>{h.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Verify Modal (Bottom Sheet) ── */}
            {modalOpen && (
                <div
                    style={{ position: 'static', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1050 }}
                    onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
                >
                    <div style={{ background: 'white', borderRadius: '16px 16px 0 0', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>

                        {/* Handle */}
                        <div style={{ width: 36, height: 4, background: '#dee2e6', borderRadius: 2, margin: '12px auto 0' }} />

                        {/* Modal Header */}
                        <div className="px-3 pt-3 pb-0">
                            <h6 className="fw-bold mb-0">Order verification</h6>
                            <p className="text-muted mb-0" style={{ fontSize: 12 }}>
                                QR Token: <code style={{ fontSize: 11 }}>{scannedToken}</code>
                            </p>
                        </div>

                        <div className="p-3">
                            {/* Invalid / Error state */}
                            {orderData?.status === 'invalid' || orderData?.status === 'error' ? (
                                <div className="alert alert-danger py-2 px-3 small mb-0">
                                    <p className="fw-bold mb-1">Invalid order</p>
                                    <p className="mb-0">{orderData.message}</p>
                                </div>
                            ) : orderData ? (
                                <>
                                    {/* Status pill */}
                                    <span className={`badge bg-${statusConfig[orderData.status]?.cls} mb-3`} style={{ fontSize: 12, padding: '5px 10px' }}>
                                        {statusConfig[orderData.status]?.label}
                                    </span>

                                    {/* Info grid */}
                                    <div className="row g-2 mb-3">
                                        <div className="col-6">
                                            <div className="bg-light rounded p-2">
                                                <p className="text-muted mb-0" style={{ fontSize: 11 }}>Customer name</p>
                                                <p className="fw-bold mb-0 small">{orderData.name}</p>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="bg-light rounded p-2">
                                                <p className="text-muted mb-0" style={{ fontSize: 11 }}>Order date</p>
                                                <p className="fw-bold mb-0 small">
                                                    {orderData.order_date
                                                        ? new Date(orderData.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                                        : '—'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="bg-light rounded p-2">
                                                <p className="text-muted mb-0" style={{ fontSize: 11 }}>Total quantity</p>
                                                <p className="fw-bold mb-0 small">{orderData.total_quantity ?? '—'}</p>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="bg-light rounded p-2">
                                                <p className="text-muted mb-0" style={{ fontSize: 11 }}>Total remaining</p>
                                                <p className="fw-bold mb-0 small text-success">{remaining - selectedQty}</p>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="bg-light rounded p-2">
                                                <p className="text-muted mb-0" style={{ fontSize: 11 }}>Product</p>
                                                <p className="fw-bold mb-0 small">{orderData.item_name ?? '—'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity selector */}
                                    {orderData.status === 'valid' && (
                                        <div className="bg-light rounded p-3 d-flex align-items-center justify-content-between mb-3">
                                            <p className="small text-muted mb-0">Select quantity to issue</p>
                                            <div className="d-flex align-items-center gap-3">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm rounded-circle"
                                                    style={{ width: 32, height: 32, padding: 0, lineHeight: 1 }}
                                                    onClick={() => setSelectedQty(q => Math.max(0, q - 1))}
                                                    disabled={selectedQty <= 0}
                                                >
                                                    −
                                                </button>
                                                <span className="fw-bold" style={{ minWidth: 24, textAlign: 'center' }}>{selectedQty}</span>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm rounded-circle"
                                                    style={{ width: 32, height: 32, padding: 0, lineHeight: 1 }}
                                                    onClick={() => setSelectedQty(q => Math.min(remaining, q + 1))}
                                                    disabled={selectedQty >= remaining}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="d-flex align-items-center gap-2 py-3">
                                    <div className="spinner-border spinner-border-sm text-primary" />
                                    <span className="text-muted small">Loading order details…</span>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="d-flex gap-2 px-3 pb-4 pt-0">
                            <button className="btn btn-outline-secondary flex-fill" onClick={closeModal}>
                                Cancel
                            </button>
                            {orderData?.status === 'valid' && (
                                <button
                                    className="btn btn-primary flex-fill"
                                    onClick={issueProduct}
                                    disabled={issuing || selectedQty < 1}
                                >
                                    {issuing
                                        ? <><span className="spinner-border spinner-border-sm me-2" />Issuing…</>
                                        : 'Issue product'
                                    }
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div
                    style={{
                        position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
                        background: toast.type === 'success' ? '#1a7340' : '#dc3545',
                        color: '#fff', padding: '10px 20px', borderRadius: 20,
                        fontSize: 13, zIndex: 1100, whiteSpace: 'nowrap',
                    }}
                >
                    {toast.msg}
                </div>
            )}
        </div>
    );
};

export default OrderVerify;