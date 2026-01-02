import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authLogin, getSellerProfile } from '../services/api';
import { useSeller } from './SellerContext';

export default function SellerLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useSeller();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authLogin({ phone, password });
      
      if (response.token) {
        // Load seller profile if available and store full seller object in context
        let sellerData = null;
        try {
          sellerData = await getSellerProfile(response.token);
        } catch (e) {
          // no seller profile yet; fallback to basic user info
          sellerData = {
            id: response.user?._id,
            email: response.user?.email,
            name: response.user?.name,
            role: response.user?.role,
          };
        }

        login(response.token, sellerData);
        navigate('/seller-dashboard');
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
            <h1 className="text-3xl font-light italic text-[#9c7c3a] mb-2 font-serif">kalaqx</h1>
            <p className="text-[#666] italic font-serif">Seller Login</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#e6ddd2] border border-[#9c7c3a] text-[#3b3b3b] rounded-lg text-sm italic font-serif">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[#3b3b3b] text-sm italic mb-2 font-serif">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
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
            Don't have a seller account?{' '}
            <a href="#" className="text-[#9c7c3a] font-light italic hover:underline font-serif">
              Contact Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
