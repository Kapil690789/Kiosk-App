// src/components/Kiosk.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Kiosk = () => {
  const [qrCode, setQrCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Fetch the QR code from the backend
  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/qrcode`);
        const data = await response.json();
        setQrCode(data.qrCode);
        setSessionId(data.sessionId);
      } catch (err) {
        console.error('Failed to fetch QR code', err);
      }
    };
    fetchQrCode();
  }, []);

  // Listen for unlock signals via Socket.IO
  useEffect(() => {
   const socket = io(import.meta.env.VITE_API_URL);
    socket.on('unlock-kiosk', (data) => {
      setIsUnlocked(true);
      console.log('Kiosk unlocked for transaction:', data.transactionId);
    });
    
    if (sessionId) {
      socket.emit('join-session', sessionId);
    }
    return () => socket.disconnect();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute w-96 h-96 bg-purple-200 rounded-full -top-48 -right-48 opacity-40 animate-blob"></div>
      <div className="absolute w-96 h-96 bg-indigo-200 rounded-full -bottom-48 -left-48 opacity-40 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 z-10">
        {!isUnlocked ? (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Scan to Start
              </h2>
              <p className="text-gray-600 text-lg">
                Use your mobile device to scan the QR code
              </p>
            </div>

            <div className="relative aspect-square w-full bg-gray-50 rounded-xl p-4 border-2 border-dashed border-indigo-100">
              {qrCode ? (
                <img 
                  src={qrCode} 
                  alt="QR Code" 
                  className="w-full h-full object-contain animate-fadeIn"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center space-x-2 text-indigo-600">
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2m4-15H8m12 0a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2h12z"/>
              </svg>
              <span>Waiting for scan...</span>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="inline-flex bg-indigo-100 p-4 rounded-full">
              <svg 
                className="w-16 h-16 text-indigo-600 animate-check" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Ready to Use!
              </h2>
              <p className="text-gray-600 text-lg">
                Kiosk unlocked for service
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span className="font-medium">Active Session</span>
            </div>
          </div>
        )}
      </div>
      
      <footer className="mt-8 text-center text-indigo-100 text-sm z-10">
        <p>Secure connection • Session ID: {sessionId || 'generating...'}</p>
      </footer>
    </div>
  );
};

export default Kiosk;
