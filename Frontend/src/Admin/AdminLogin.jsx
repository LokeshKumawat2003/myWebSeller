import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authLogin } from '../services/api';
import { useAdmin } from './AdminContext';
import Logo from '../components/Logo';

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
    <div className="min-h-screen bg-[#fbf7f2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-[#e6ddd2]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <Logo size="lg" />
            </div>
            <h1 className="text-3xl font-light italic text-[#9c7c3a] mb-2 font-serif">kalaqx Admin</h1>
            <p className="text-[#666] italic font-serif">Administrator Panel</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#e6ddd2] border border-[#9c7c3a] text-[#3b3b3b] rounded-lg text-sm italic font-serif">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-[#3b3b3b] text-sm italic mb-2 font-serif">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter admin phone number"
                required
                autoComplete="username"
                className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-[#9c7c3a] transition bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#3b3b3b] text-sm italic mb-2 font-serif">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-[#9c7c3a] transition bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-white disabled:text-[#666] font-light italic py-3 rounded-lg transition duration-200 mt-6 font-serif"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-[#666] text-sm mt-6 italic font-serif">
            Admin access required
          </p>
        </div>
      </div>
    </div>
  );
}
