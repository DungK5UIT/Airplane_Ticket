import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import AdminAuth from './pages/AdminAuth';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegulations from './pages/AdminRegulations';
import AdminRevenue from './pages/AdminRevenue';
import Flight from './pages/Flight';
import FlightDetail from './pages/FlightDetail';
import Orders from './pages/Orders';
import MyFlights from './pages/MyFlights';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import Payment from './pages/Payment';
import Promotions from './pages/Promotions';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/admin" element={<AdminAuth />} />
        <Route path="/" element={<Home />} />
        <Route path="/flight" element={<Flight />} />
        <Route path="/flight-detail" element={<FlightDetail />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/my-flights" element={<MyFlights />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/support" element={<Support />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/regulations" element={<AdminRegulations />} />
        <Route path="/admin/revenue" element={<AdminRevenue />} />
      </Routes>
    </Router>
  );
}

export default App;
