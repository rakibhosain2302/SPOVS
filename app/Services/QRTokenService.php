<?php

namespace App\Services;

use Illuminate\Support\Str;

class QRTokenService
{
    /**
     * Generate a unique QR token
     * Format: QR-XXXXXXXXXX (3 + 12 random characters)
     */
    public static function generateToken(): string
    {
        return 'QR-' . strtoupper(Str::random(12));
    }

    /**
     * Generate a readable QR token with timestamp
     * Format: QR-YYYYMMDD-XXXXXX (3 + 8 date + 1 dash + 6 random)
     */
    public static function generateTimestampedToken(): string
    {
        $timestamp = now()->format('Ymd');
        $random = strtoupper(Str::random(6));
        return "QR-{$timestamp}-{$random}";
    }

    /**
     * Validate token format
     */
    public static function isValidToken($token): bool
    {
        return preg_match('/^QR-[A-Z0-9]+$/', $token) === 1;
    }

    /**
     * Generate display-friendly QR code data
     * Contains both token and UUID for scanning flexibility
     */
    public static function generateQRData($qrToken, $orderUUID): string
    {
        return json_encode([
            'token' => $qrToken,
            'order' => $orderUUID,
            'type' => 'order',
            'generated_at' => now()->toIso8601String(),
        ]);
    }
}
