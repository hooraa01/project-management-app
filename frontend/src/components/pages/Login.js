import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (userId) {
      localStorage.setItem('user_id', userId);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="User ID (e.g., 1)"
            required
          />
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;