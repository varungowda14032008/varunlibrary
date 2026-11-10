import React, { useState, useEffect, useRef } from 'react';
import { Book } from '../types';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onBarcodeResolved: (book: Book, action: 'issue' | 'return') => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  books,
  onBarcodeResolved,
  showToast
}) => {
  const [manualCode, setManualCode] = useState<string>('');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setManualCode('');
      setCameraError(null);
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API is not supported in this browser/device.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      showToast('Camera optical feed initialized.', 'info');
    } catch (err: any) {
      console.warn('Camera access warning:', err);
      setCameraError('Camera access not granted or unavailable in this window.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  if (!isOpen) return null;

  const handleLookup = (codeToSearch: string) => {
    const cleanCode = codeToSearch.trim();
    if (!cleanCode) {
      showToast('Please enter or scan a barcode/ISBN.', 'warning');
      return;
    }
    const foundBook = books.find(
      b => b.barcode === cleanCode || b.id.toLowerCase() === cleanCode.toLowerCase()
    );

    if (foundBook) {
      showToast(`Identified "${foundBook.title}" (${foundBook.id})`, 'success');
      onBarcodeResolved(foundBook, foundBook.available > 0 ? 'issue' : 'return');
      onClose();
    } else {
      showToast(`No catalog entry matched barcode "${cleanCode}".`, 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4">
      <div className="bg-[#162734] border border-[#cda659]/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#223a4d] flex items-center justify-between bg-[#111f2a]/90">
          <div className="flex items-center gap-2">
            <span className="text-xl">📷</span>
            <div>
              <h3 className="font-cinzel font-bold text-white text-sm tracking-wider">
                Optical Barcode & ISBN Scanner
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Supports Hardware USB Barcode Guns & Live Device Cameras
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-base p-1.5 rounded-lg hover:bg-[#223a4d] transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 space-y-5">
          {/* Camera Viewfinder */}
          <div className="bg-[#111f2a] border border-[#223a4d] rounded-2xl overflow-hidden p-3 relative text-center">
            {cameraActive ? (
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <div className="absolute inset-0 border-2 border-[#cda659]/70 border-dashed pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-24 border-2 border-emerald-400 rounded-lg flex items-center justify-center">
                    <span className="text-[10px] font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded">
                      Align Barcode Here
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-2xl mx-auto">
                  📷
                </div>
                <p className="text-xs text-slate-300 font-medium">Live Camera Scan Viewfinder</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Activate device camera to optically scan the physical book's barcode or ISBN strip.
                </p>
                {cameraError && (
                  <p className="text-[11px] text-amber-400 font-mono pt-1">
                    {cameraError}
                  </p>
                )}
                <div className="pt-2">
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Activate Optical Camera
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Manual / Barcode Gun Input */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Manual Barcode / Scanner Gun Input
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleLookup(manualCode);
                  }
                }}
                placeholder="Scan or type barcode (e.g. 9780262046305)"
                className="w-full px-3 py-2.5 rounded-xl bg-[#111f2a] border border-[#223a4d] text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#cda659]"
                autoFocus
              />
              <button
                onClick={() => handleLookup(manualCode)}
                className="px-4 py-2 rounded-xl bg-[#cda659] hover:bg-[#b58f44] text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer whitespace-nowrap"
              >
                Scan Code
              </button>
            </div>
          </div>

          {/* Quick-test Presets from Catalog */}
          <div className="space-y-2 pt-2 border-t border-[#223a4d]">
            <span className="text-[11px] text-slate-400 block font-semibold">
              Sample Physical Barcodes from Current Catalog:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
              {books.map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    setManualCode(b.barcode);
                    handleLookup(b.barcode);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#111f2a] hover:bg-[#1a2f3f] border border-[#223a4d] text-[10px] font-mono text-indigo-300 text-left transition cursor-pointer"
                >
                  {b.id}: {b.barcode} ({b.title.slice(0, 22)}...)
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
