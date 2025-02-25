// src/components/ServiceSelection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';

const ServiceSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionParam = searchParams.get('session'); // Get session from URL if provided

  // Clear any previous transaction data on mount
  useEffect(() => {
    localStorage.removeItem('transaction');
  }, []);

  const [selectedItem, setSelectedItem] = useState('');
  const [amount, setAmount] = useState(''); // Start with empty string so there's no preset value
  const kioskId = 'kiosk123';
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('transaction');
    navigate('/', { replace: true });
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Create the transaction object from user input.
    // Convert the amount to a number.
    const transactionData = {
      kioskId,
      item: selectedItem,
      amount: Number(amount),
      sessionId: sessionParam || null,
    };

    console.log("Submitting Transaction:", transactionData);
    localStorage.setItem('transaction', JSON.stringify(transactionData));
    navigate('/payment');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl relative">
        {/* Logout Button inside the container */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 flex items-center p-2 text-gray-600 hover:text-red-600"
          title="Logout"
        >
          <FaSignOutAlt className="w-6 h-6" />
          <span className="ml-1">Logout</span>
        </button>
      
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <FaShoppingCart className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Select Service
        </h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Item</label>
            <div className="relative">
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500"
                required
              >
                <option value="">--Select--</option>
                <option value="Service A">Service A</option>
                <option value="Service B">Service B</option>
                <option value="Service C">Service C</option>
                <option value="Service D">Service D</option>
              </select>
              <FaShoppingCart className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter amount"
                required
              />
              <FaMoneyBillWave className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceSelection;
