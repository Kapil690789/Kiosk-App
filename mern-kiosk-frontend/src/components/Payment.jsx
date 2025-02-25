// src/components/Payment.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaCheckCircle, FaTimesCircle, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';

const Payment = () => {
  const navigate = useNavigate();
  const transaction = JSON.parse(localStorage.getItem('transaction'));
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('transaction');
    navigate('/', { replace: true });
  };

  // Back button function
  const handleBack = () => {
    navigate('/mobile');
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentStatus('');
    try {
      const token = localStorage.getItem('token');
      // Initiate the transaction on the backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/kiosk/initiate`,
        transaction,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const orderData = res.data.transaction;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderData.amount * 100,
        currency: 'INR',
        name: 'Kiosk Service',
        description: orderData.item,
        order_id: orderData.razorpay_order_id,
        handler: async function (response) {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/kiosk/confirm`,
              {
                transactionId: orderData._id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setPaymentStatus('Payment Successful! Kiosk unlocked.');
            navigate('/');
          } catch (err) {
            console.error('Confirmation error:', err);
            setPaymentStatus('Payment confirmation failed.');
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus('Payment cancelled. Please try again.');
          },
        },
        prefill: { email: 'test@example.com' },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        setPaymentStatus('Payment failed. Please try again.');
      });
      rzp.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      setPaymentStatus('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-purple-200 rounded-full -top-48 -right-48 opacity-40 animate-blob"></div>
      <div className="absolute w-96 h-96 bg-indigo-200 rounded-full -bottom-48 -left-48 opacity-40 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 flex items-center p-2 text-gray-600 hover:text-indigo-600"
          title="Logout"
        >
          <FaSignOutAlt className="w-6 h-6" />
          <span className="ml-1">Logout</span>
        </button>

        <button
          onClick={handleBack}
          className="absolute top-4 left-4 flex items-center p-2 text-gray-600 hover:text-indigo-600"
          title="Back"
        >
          <FaArrowLeft className="w-6 h-6" />
          <span className="ml-1">Back</span>
        </button>

        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <FaCreditCard className="w-10 h-10 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Payment
        </h2>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">Amount:</p>
            <p className="text-2xl font-bold text-gray-900">₹{transaction?.amount}</p>
          </div>

          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Pay Now'}
          </button>

          {paymentStatus && (
            <div className={`mt-6 p-4 rounded-lg ${paymentStatus.includes('Successful') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {paymentStatus.includes('Successful') ? <FaCheckCircle className="w-5 h-5 text-green-500 mr-2" /> : <FaTimesCircle className="w-5 h-5 text-red-500 mr-2" />}
              <span className={paymentStatus.includes('Successful') ? 'text-green-600' : 'text-red-600'}>{paymentStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
