import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authLogin } from '../services/api';
import { useAdmin } from './AdminContext';

export default function AdminLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authLogin({ phone, password });
      
      if (response.token && response.user?.role === 'admin') {
        const adminData = {
          id: response.user?._id,
          email: response.user?.email,
          name: response.user?.name,
          role: response.user?.role,
        };
        
        login(response.token, adminData);
        navigate('/admin-dashboard');
      } else if (response.token && response.user?.role !== 'admin') {
        setError('Admin access only. This account does not have admin privileges.');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen luxury-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="luxury-bg rounded-lg shadow-2xl p-8 luxury-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold luxury-accent mb-2">kalaqx Admin</h1>
            <p className="luxury-text-primary font-medium">Administrator Panel</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block luxury-text-primary text-sm font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter admin phone number"
                required
                autoComplete="username"
                className="w-full px-4 py-3 border luxury-border rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-accent transition luxury-bg"
              />
            </div>

            <div>
              <label className="block luxury-text-primary text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border luxury-border rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-accent transition luxury-bg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full luxury-accent hover:luxury-accent/90 disabled:luxury-bg-secondary text-white font-bold py-3 rounded-lg transition duration-200 mt-6"
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>

          <p className="text-center luxury-text-primary text-sm mt-6">
            Admin access required
          </p>
        </div>
      </div>
    </div>
  );
}
