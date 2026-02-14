import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authLogin, authRegister, setAuthToken, API_URL } from '../../services/api';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authLogin({ phone: formData.phone, password: formData.password });
        setAuthToken(response.token);
        navigate('/');
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const response = await authRegister({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password });
        setAuthToken(response.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf7f2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8 border border-[#e6ddd2]">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-light italic text-[#9c7c3a] mb-2 font-serif">kalaqx</h1>
            <p className="text-[#666] italic font-serif">{isLogin ? 'Sign in to your account' : 'Create your account'}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#e6ddd2] border border-[#9c7c3a] text-[#3b3b3b] rounded-lg text-sm italic font-serif">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-[#3b3b3b] text-sm italic mb-2 font-serif">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-[#9c7c3a] transition bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]"
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-[#3b3b3b] text-sm italic mb-2 font-serif">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required={!isLogin}
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-[#9c7c3a] transition bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]"
                />
              </div>
            )}

            <div>
              <label className="block text-[#3b3b3b] text-sm italic mb-2 font-serif">Phone number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-[#9c7c3a] transition bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]"
              />
            </div>

            <div>
              <label className="block text-[#3b3b3b] text-sm italic mb-2 font-serif">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-[#9c7c3a] transition bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[#3b3b3b] text-sm italic mb-2 font-serif">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required={!isLogin}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-[#9c7c3a] transition bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-white disabled:text-[#666] font-light italic py-3 rounded-lg transition duration-200 mt-2 font-serif"
            >
              {loading ? (isLogin ? 'Signing in...' : 'Signing up...') : (isLogin ? 'Sign in' : 'Sign up')}
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#1922d2] italic font-serif text-sm"
              >
                {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </button>
            </div>

            <div className="text-center mt-2">
              <a
                href={`${API_URL}/auth/google`}
                className="inline-flex items-center justify-center py-2 px-4 border border-[#e6ddd2] rounded-md text-sm text-[#3b3b3b] bg-white hover:bg-gray-50 italic font-serif"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path fill="#4285f4" d="M533.5 278.4c0-17.5-1.6-35-4.9-51.8H272v98.1h147.5c-6.4 34.6-25.7 63.9-54.8 83.6v69.4h88.6c51.9-47.8 81.2-118.1 81.2-199.3z"/>
                  <path fill="#34a853" d="M272 544.3c73.6 0 135.5-24.4 180.6-66.2l-88.6-69.4c-24.6 16.5-56 26.1-92 26.1-70.8 0-130.9-47.8-152.3-112.3H27.1v70.6C71.6 489.1 166.6 544.3 272 544.3z"/>
                  <path fill="#fbbc04" d="M119.7 329.5c-10.8-32.6-10.8-67.9 0-100.5V158.4H27.1c-39.7 79.5-39.7 172.4 0 251.9l92.6-80.8z"/>
                  <path fill="#ea4335" d="M272 109.1c39.9 0 75.9 13.8 104.2 40.9l78-78C405.9 25.6 344 0 272 0 166.6 0 71.6 55.2 27.1 139.1l92.6 70.6C141.1 156.9 201.2 109.1 272 109.1z"/>
                </svg>
                Sign in with Google
              </a>
            </div>
          </form>

          <p className="text-center text-[#666] text-sm mt-6 italic font-serif">
            By signing in you agree to our terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;