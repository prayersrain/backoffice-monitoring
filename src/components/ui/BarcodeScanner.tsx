'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, RefreshCw } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function BarcodeScanner({ onScan, onClose, isOpen }: BarcodeScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize scanner when modal opens
      const scanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.0,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.DATA_MATRIX,
          ],
        },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          // 1. Cek apakah ini Link Postel (Sertifikasi)
          if (decodedText.includes('postel.go.id')) {
            setError('Itu Barcode Sertifikasi (Postel). Cari kotak kecil yang titik-titiknya lebih padat di sebelahnya.');
            return;
          }

          setError(null);

          // 2. LOGIC: 
          // IMEI Murni (15 digit angka)
          const isIMEI = /^\d{15}$/.test(decodedText);
          
          // Data Box iPhone (Biasanya mengandung 1P untuk Part Number DAN IMEI)
          const hasMPN = decodedText.includes('1P');
          const hasIMEI = decodedText.includes('IMEI') || /\d{15}/.test(decodedText);
          const isIPhoneBox = (hasMPN && hasIMEI) || decodedText.startsWith('30S');
          
          if (isIMEI || isIPhoneBox) {
            onScan(decodedText);
            scanner.clear();
            onClose();
          } else {
            console.log('Detected other code:', decodedText);
          }
        },
        (errorMessage) => {
          // We don't want to show every frame error, 
          // just keep it in state if it's a persistent issue
        }
      );

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error('Failed to clear scanner', err));
      }
    };
  }, [isOpen, onScan, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden bg-[var(--card)] border border-white/10 rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="font-bold">Scan Barcode / QR</h3>
              <p className="text-xs text-[var(--muted)]">Arahkan kamera ke kode di box iPhone</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-[var(--muted)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-6">
          <div 
            id="reader" 
            className="overflow-hidden rounded-2xl bg-black/40 border border-white/5"
          ></div>
          
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-[var(--muted)] bg-white/5 p-3 rounded-xl">
              <RefreshCw size={14} className="animate-spin-slow" />
              <span>Pastikan pencahayaan cukup dan kode terlihat jelas.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/5 text-center">
          <button 
            onClick={onClose}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
