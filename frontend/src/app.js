import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Updated paths to match your folder structure
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';

const isAuthenticated = () => !!localStorage.getItem('user_id');

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;