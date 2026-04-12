import React, { useRef, useState, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import axios from 'axios';

const OrderVerify = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animRef = useRef(null);

    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [manualId, setManualId] = useState('');
    const [history, setHistory] = useState([]);
    const [lineY, setLineY] = useState(0);

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
        setResult(null);
        try {
            const res = await axios.get(`/api/verify-ticket/${ticketId.trim()}`);
            const data = res.data;
            setResult(data);
            setHistory(prev => [
                { id: ticketId, status: data.status, time: new Date().toLocaleTimeString() },
                ...prev.slice(0, 4),
            ]);
        } catch (err) {
            const errData = err.response?.data;
            setResult({
                status: 'invalid',
                message: errData?.message || 'Ticket not found.',
            });
            setHistory(prev => [
                { id: ticketId, status: 'invalid', time: new Date().toLocaleTimeString() },
                ...prev.slice(0, 4),
            ]);
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
                verifyTicket(code.data);
                return;
            }
        }
        animRef.current = requestAnimationFrame(scanFrame);
    }, [stopScan, verifyTicket]);

    const startScan = async () => {
        setResult(null);
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
            setResult({ status: 'error', message: 'Camera access denied or not available.' });
        }
    };

    useEffect(() => () => stopScan(), [stopScan]);

    const statusConfig = {
        valid:   { label: '✓ Valid Ticket',    cls: 'success' },
        used:    { label: '⚠ Already Used',     cls: 'warning' },
        invalid: { label: '✗ Invalid Ticket',   cls: 'danger'  },
        error:   { label: '✗ Error',            cls: 'danger'  },
    };

    const handleManualKeyDown = (e) => {
        if (e.key === 'Enter') {
            verifyTicket(manualId);
            setManualId('');
        }
    };

    const handleManualVerify = () => {
        verifyTicket(manualId);
        setManualId('');
    };

    return (
        <div className="container py-4" style={{ maxWidth: 480 }}>

            {/* Header */}
            <div className="mb-3">
                <h4 className="fw-bold mb-1">QR Ticket Scanner</h4>
                <p className="text-muted small mb-0">Scan a QR code or enter ticket ID to verify</p>
            </div>

            {/* Camera Box */}
            <div className="border rounded-3 overflow-hidden mb-3 bg-dark">
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <video
                        ref={videoRef}
                        style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                            display: scanning ? 'block' : 'none',
                        }}
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    {/* Scanner overlay */}
                    {scanning && (
                        <svg
                            viewBox="0 0 100 100"
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Dim overlay */}
                            <path d="M0,0 H100 V100 H0 Z M20,20 H80 V80 H20 Z" fill="rgba(0,0,0,0.45)" fillRule="evenodd" />
                            {/* Corner brackets */}
                            <polyline points="20,32 20,20 32,20" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                            <polyline points="68,20 80,20 80,32" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                            <polyline points="20,68 20,80 32,80" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                            <polyline points="68,80 80,80 80,68" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                            {/* Scan line */}
                            <rect x="22" y={20 + (lineY / 100) * 60} width="56" height="1.5" fill="rgba(74,222,128,0.7)" rx="1" />
                        </svg>
                    )}

                    {/* Placeholder */}
                    {!scanning && (
                        <div className="text-center">
                            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
                                <rect x="3" y="3" width="20" height="20" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none"/>
                                <rect x="8" y="8" width="8" height="8" fill="rgba(255,255,255,0.4)" rx="1"/>
                                <rect x="33" y="3" width="20" height="20" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none"/>
                                <rect x="38" y="8" width="8" height="8" fill="rgba(255,255,255,0.4)" rx="1"/>
                                <rect x="3" y="33" width="20" height="20" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none"/>
                                <rect x="8" y="38" width="8" height="8" fill="rgba(255,255,255,0.4)" rx="1"/>
                                <rect x="33" y="33" width="5" height="5" fill="rgba(255,255,255,0.4)" rx="1"/>
                                <rect x="41" y="33" width="5" height="5" fill="rgba(255,255,255,0.4)" rx="1"/>
                                <rect x="49" y="33" width="5" height="5" fill="rgba(255,255,255,0.4)" rx="1"/>
                                <rect x="33" y="41" width="5" height="5" fill="rgba(255,255,255,0.4)" rx="1"/>
                                <rect x="41" y="41" width="5" height="5" fill="rgba(255,255,255,0.4)" rx="1"/>
                                <rect x="49" y="49" width="5" height="5" fill="rgba(255,255,255,0.4)" rx="1"/>
                            </svg>
                            <p className="text-white-50 small mb-0">Camera inactive</p>
                        </div>
                    )}
                </div>

                {/* Result */}
                {(loading || result) && (
                    <div className="bg-white p-3 border-top">
                        {loading ? (
                            <div className="d-flex align-items-center gap-2">
                                <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                <span className="text-muted small">Verifying ticket...</span>
                            </div>
                        ) : result && (
                            <div className={`alert alert-${statusConfig[result.status]?.cls || 'secondary'} mb-0 py-2 px-3`}>
                                <p className="fw-bold mb-1 small">{statusConfig[result.status]?.label}</p>
                                {result.name && (
                                    <div className="row g-2 mt-1">
                                        <div className="col-6">
                                            <p className="text-muted mb-0" style={{ fontSize: 11 }}>Name</p>
                                            <p className="fw-bold mb-0 small">{result.name}</p>
                                        </div>
                                        <div className="col-6">
                                            <p className="text-muted mb-0" style={{ fontSize: 11 }}>Event</p>
                                            <p className="fw-bold mb-0 small">{result.event}</p>
                                        </div>
                                        {result.seat && (
                                            <div className="col-6">
                                                <p className="text-muted mb-0" style={{ fontSize: 11 }}>Seat</p>
                                                <p className="fw-bold mb-0 small">{result.seat}</p>
                                            </div>
                                        )}
                                        {result.used_at && (
                                            <div className="col-6">
                                                <p className="text-muted mb-0" style={{ fontSize: 11 }}>Used At</p>
                                                <p className="fw-bold mb-0 small">{result.used_at}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {result.message && !result.name && (
                                    <p className="mb-0 small">{result.message}</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="d-flex gap-2 mb-3">
                {!scanning ? (
                    <button className="btn btn-primary flex-fill" onClick={startScan}>
                        Start Scanning
                    </button>
                ) : (
                    <button className="btn btn-secondary flex-fill" onClick={stopScan}>
                        Stop Camera
                    </button>
                )}
                <button
                    className="btn btn-outline-secondary flex-fill"
                    onClick={() => { stopScan(); setResult(null); }}
                >
                    Reset
                </button>
            </div>

            {/* Manual Entry */}
            <div className="bg-light rounded-3 p-3 mb-3">
                <p className="small fw-bold text-muted mb-2">Manual Entry</p>
                <div className="input-group input-group-sm">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter ticket ID (e.g. TKT-001)..."
                        value={manualId}
                        onChange={e => setManualId(e.target.value)}
                        onKeyDown={handleManualKeyDown}
                    />
                    <button className="btn btn-primary" onClick={handleManualVerify} disabled={loading}>
                        Verify
                    </button>
                </div>
            </div>

            {/* Scan History */}
            {history.length > 0 && (
                <div>
                    <p className="small fw-bold text-muted mb-2">Recent Scans</p>
                    <div className="d-flex flex-column gap-1">
                        {history.map((h, i) => (
                            <div
                                key={i}
                                className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded border"
                            >
                                <span className="small fw-bold">{h.id}</span>
                                <div className="d-flex align-items-center gap-2">
                                    <span className={`badge bg-${statusConfig[h.status]?.cls} text-white`} style={{ fontSize: 11 }}>
                                        {statusConfig[h.status]?.label?.replace(/^[✓✗⚠] /, '')}
                                    </span>
                                    <span className="text-muted" style={{ fontSize: 11 }}>{h.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderVerify;