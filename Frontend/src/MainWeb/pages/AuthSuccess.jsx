import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../services/api';

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse token from query string (?token=...)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setAuthToken(token);
      // Log google login for debugging
      console.log('Google login successful, token:', token);
      // Force a full-page redirect to home to ensure app state resets correctly
      window.location.replace('/');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#fbf7f2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8 border border-[#e6ddd2] text-center">
          <h1 className="text-3xl font-light italic text-[#9c7c3a] mb-2 font-serif">kalaqx</h1>
          <p className="text-[#666] italic font-serif mb-6">Signing you in...</p>

          <div className="flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-[#9c7c3a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>

          <div className="mt-6 text-sm text-[#666] italic font-serif">You will be redirected to the home page shortly.</div>
        </div>
      </div>
    </div>
  );
}
