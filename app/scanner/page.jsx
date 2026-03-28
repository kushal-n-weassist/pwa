"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { LucideZap, LucideImage, LucideX, LucideRefreshCw, LucideLoader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { setScannerData, fetchHospitals } from "@/features/details/store/detailsSlice";
import { Button } from "@heroui/react";
import jsQR from "jsqr";
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { resetAllDetails } from '@/features/details/store/detailsSlice';

const Scanner = dynamic(
    () => import('@yudiel/react-qr-scanner').then(m => m.Scanner),
    { ssr: false }
);

export default function ScannerPage() {

    const [torchOn, setTorchOn] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [facingMode, setFacingMode] = useState('environment');
    const [scannedData, setScannedData] = useState(null);

    const scannedDataRef = useRef(null);
    const isProcessingRef = useRef(false);
    const permittedHospitalsRef = useRef([]);

    const { permittedHospitals } = useSelector((state) => state.details);

    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        permittedHospitalsRef.current = permittedHospitals;
    }, [permittedHospitals]);

    useEffect(() => {
        dispatch(resetAllDetails());
    }, [])

    const setScannedDataSync = (data) => {
        scannedDataRef.current = data;
        setScannedData(data);
        console.log("the scanner data", scannedData);
    };

    const setIsProcessingSync = (val) => {
        isProcessingRef.current = val;
        setIsProcessing(val);
    };

    useEffect(() => {
        if (
            typeof navigator === 'undefined' ||
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {
            return;
        }

        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: 'environment' } })
            .then((stream) => {
                stream.getTracks().forEach((t) => t.stop());
            })
            .catch(() => setPermissionDenied(true));
    }, []);

    useEffect(() => {
        dispatch(fetchHospitals());
    }, [dispatch]);

    const processResult = useCallback((rawValue) => {
        if (!rawValue) return;

        const cleaned = rawValue.trim().replace(/'/g, '"');
        console.log("the cleaned", cleaned);

        try {
            let hospitalId, type, city;

            try {
                const parsed = JSON.parse(cleaned);
                hospitalId = parsed.hospital;
                type = parsed.type || parsed.claim_type;
                city = parsed.city;
                console.log("parsed QR:", parsed, hospitalId, type, city);
            } catch {
                console.log("JSON parse failed — treating as plain hospital ID");
                hospitalId = cleaned;
            }

            // All 3 fields are required — any missing = invalid hospital QR
            if (!hospitalId || !type || !city) {
                toast.error("Invalid QR code. Please scan a hospital QR code.", {
                    duration: 4000,
                    style: { borderRadius: '20px', background: '#fff', color: '#333', fontSize: '14px', fontWeight: 'bold' },
                });
                setIsProcessingSync(false);
                return;
            }

            const match = permittedHospitalsRef.current.find(h => h.name === hospitalId);

            setScannedDataSync({
                hospitalId,
                hospitalName: match ? match.title : "Unknown Hospital",
                claim_type: type,
                city,
            });

            setIsProcessingSync(false);
        } catch (err) {
            toast.error("Could not read QR code. Please try again.", {
                duration: 4000,
                style: { borderRadius: '20px', background: '#fff', color: '#333', fontSize: '14px', fontWeight: 'bold' },
            });
            setIsProcessingSync(false);
        }
    }, []);

    const handleConfirmContinue = () => {
        dispatch(setScannerData(scannedData));
        router.push("/newrequest");
    };

    const handleScan = useCallback((result) => {
        if (!result || isProcessingRef.current || scannedDataRef.current) return;
        const rawValue = result[0]?.rawValue || result;
        console.log("raw value ", rawValue);
        console.log("the result ", result);
        processResult(rawValue);
    }, [processResult]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        console.log("the file", file);
        if (!file) return;

        e.target.value = '';

        setIsProcessingSync(true);
        const reader = new FileReader();

        reader.onload = (event) => {
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0, image.width, image.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                console.log("the code ", code);

                if (code) {
                    processResult(code.data);
                } else {
                    toast.error("Invalid QR: Could not process details.", {
                        duration: 4000,
                        style: {
                            borderRadius: '20px',
                            background: '#fff',
                            color: '#333',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        },
                    });
                    setIsProcessingSync(false);
                }
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const flipCamera = () => {
        setTorchOn(false);
        setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    };

    if (permissionDenied) {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4 z-[100]">
                <p className="text-white text-center font-semibold px-8 leading-relaxed">
                    Camera access denied. <br /> Please enable permissions in your browser settings to scan.
                </p>
                <button
                    onClick={() => router.back()}
                    className="bg-white/20 text-white px-8 py-3 rounded-2xl font-bold active:scale-95 transition-transform"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
            {isProcessing && (
                <div className="absolute inset-0 z-[200] bg-black/80 flex flex-col items-center justify-center gap-3">
                    <LucideLoader2 className="text-[#1DA1FA] animate-spin" size={48} />
                    <p className="text-white font-bold">Decoding Image...</p>
                </div>
            )}

            <Scanner
                onScan={handleScan}
                onError={(err) => console.error(err)}
                constraints={{
                    facingMode: { ideal: facingMode },
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    }
                }}
                components={{ audio: false, finder: false }}
                styles={{
                    container: { position: 'absolute', inset: 0, width: '100vw', height: '100vh' },
                    video: { width: '100%', height: '100%', objectFit: 'cover' },
                }}
            />

            <div className="absolute inset-0 z-[105]" style={{ pointerEvents: 'none' }}>
                <div className="absolute top-0 left-0 right-0 bg-black/60 backdrop-blur-[2px]" style={{ height: 'calc(50% - 120px)' }} />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-[2px]" style={{ height: 'calc(50% - 120px)' }} />
                <div className="absolute left-0 bg-black/60 backdrop-blur-[2px]" style={{ top: 'calc(50% - 120px)', bottom: 'calc(50% - 120px)', width: 'calc(50% - 120px)' }} />
                <div className="absolute right-0 bg-black/60 backdrop-blur-[2px]" style={{ top: 'calc(50% - 120px)', bottom: 'calc(50% - 120px)', width: 'calc(50% - 120px)' }} />

                <div className="absolute" style={{ top: 'calc(50% - 120px)', left: 'calc(50% - 120px)', width: 240, height: 240 }}>
                    <span className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white rounded-tl-2xl" />
                    <span className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white rounded-tr-2xl" />
                    <span className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white rounded-bl-2xl" />
                    <span className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white rounded-br-2xl" />
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute left-4 right-4 h-[2px] bg-[#1DA1FA]" style={{ animation: 'scanline 2.5s ease-in-out infinite', boxShadow: '0 0 12px 3px rgba(29,161,250,0.8)' }} />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scanline {
                    0%   { top: 10%; opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { top: 90%; opacity: 0; }
                }
            `}</style>

            <div className="absolute top-0 left-0 right-0 z-[120] flex justify-between items-center px-6 pt-12 pb-4">
                <h2 className="text-white font-bold text-xl tracking-tight">Scanner</h2>
                <button onClick={() => router.back()} className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center active:scale-90 transition-all">
                    <LucideX size={22} />
                </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-[120] pb-20 flex justify-center items-center gap-10">
                <div className="flex flex-col items-center gap-3">
                    <button
                        onClick={() => facingMode === 'environment' && setTorchOn(!torchOn)}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${torchOn ? 'bg-yellow-400 text-black scale-110' : 'bg-white/15 backdrop-blur-md text-white'}`}>
                        <LucideZap size={26} fill={torchOn ? 'currentColor' : 'none'} />
                    </button>
                    <span className="text-white/90 text-[12px] font-bold">Flash</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <button onClick={flipCamera} className="w-16 h-16 rounded-full flex items-center justify-center bg-white/15 backdrop-blur-md text-white active:rotate-180 transition-transform duration-500 shadow-xl">
                        <LucideRefreshCw size={26} />
                    </button>
                    <span className="text-white/90 text-[12px] font-bold">Flip</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <input type="file" accept="image/*" id="qr-file-upload" className="hidden" onChange={handleFileUpload} />
                    <button onClick={() => document.getElementById('qr-file-upload').click()} className="w-16 h-16 rounded-full flex items-center justify-center bg-white/15 backdrop-blur-md text-white shadow-xl">
                        <LucideImage size={26} />
                    </button>
                    <span className="text-white/90 text-[12px] font-bold">Upload</span>
                </div>
            </div>

            {scannedData && (
                <div className="absolute inset-0 z-[300] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" style={{ pointerEvents: 'auto' }}>
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                        <div className="flex flex-col gap-1 mb-6">
                            <h3 className="text-2xl font-black text-gray-900">Hospital Found</h3>
                            <p className="text-gray-500 font-medium">Verify details before proceeding.</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-gray-500 font-bold text-sm flex-shrink-0 mr-4">Hospital</span>
                                <span className="text-gray-900 font-black text-right">{scannedData.hospitalName}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-gray-500 font-bold text-sm flex-shrink-0 mr-4">Claim Type</span>
                                <span className="text-[#1DA1FA] font-black uppercase text-right">{scannedData.claim_type}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-gray-500 font-bold text-sm flex-shrink-0 mr-4">Location</span>
                                <span className="text-gray-900 font-black text-right">{scannedData.city}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="flat"
                                onPress={() => setScannedDataSync(null)}
                                className="flex-1 h-14 rounded-xl font-bold text-gray-500"
                            >
                                Rescan
                            </Button>
                            <Button
                                onPress={handleConfirmContinue}
                                className="flex-[2] bg-[#1DA1FA] text-white font-black h-14 rounded-xl text-lg shadow-lg"
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}