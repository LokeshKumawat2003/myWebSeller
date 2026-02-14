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
    <div className="min-h-screen flex items-center justify-center">
      <div>Signing you in...</div>
    </div>
  );
}
