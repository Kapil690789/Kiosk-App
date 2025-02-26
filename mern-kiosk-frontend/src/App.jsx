// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Kiosk from './components/Kiosk';
import ServiceSelection from './components/ServiceSelection';
import Payment from './components/Payment';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Mobile Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Mobile Flow */}
        <Route element={<ProtectedRoute />}>
          <Route path="/mobile" element={<ServiceSelection />} />
          <Route path="/payment" element={<Payment />} />
        </Route>
        
        {/* Kiosk Display (for the physical kiosk, no auth needed) */}
        <Route path="/" element={<Kiosk />} />
      </Routes>
    </Router>
  );
}

export default App;
