import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOTPRegister, sendOTPLogin, verifyOTPRegister, verifyOTPLogin, setAuthToken, API_URL } from '../../services/api';
import Logo from '../../components/Logo';

const LoginPage = () => {
  const [step, setStep] = useState('choice'); // choice, phone, otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(null);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const startOTPTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const handleSendOTP = async (e) => {
    e && e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try login first, if not found -> register
      try {
        await sendOTPLogin({ phone });
        setIsExistingUser(true);
      } catch (err) {
        const msg = (err && err.message) || '';
        if (msg.includes('(404)') || msg.toLowerCase().includes('not found')) {
          await sendOTPRegister({ phone });
          setIsExistingUser(false);
        } else {
          throw err;
        }
      }
      setStep('otp');
      setOtp('');
      startOTPTimer();
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isExistingUser) {
        const response = await verifyOTPLogin({ phone, otp });
        setAuthToken(response.token);
        navigate('/');
      } else {
        const response = await verifyOTPRegister({ phone, otp });
        setAuthToken(response.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf7f2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8 border border-[#e6ddd2]">
          <div className="text-center mb-6">
            <div className="mb-4 flex justify-center">
              <Logo size="lg" />
            </div>
            <h1 className="text-3xl font-light italic text-[#9c7c3a] mb-2 font-serif">kalaqx</h1>
            <p className="text-[#666] italic font-serif">Sign in or create account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#e6ddd2] border border-[#9c7c3a] text-[#3b3b3b] rounded-lg text-sm italic font-serif">{error}</div>
          )}

          {step === 'choice' ? (
            <div className="space-y-4">
              <a href={`${API_URL}/auth/google`} className="w-full inline-flex items-center justify-center gap-3 py-3 border border-[#e6ddd2] rounded-lg text-[#3b3b3b] bg-white hover:shadow-sm italic font-serif transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </a>
              <button onClick={() => { setStep('phone'); setError(''); setPhone(''); }} className="w-full inline-flex items-center justify-center gap-3 py-3 border border-[#e6ddd2] rounded-lg text-[#3b3b3b] bg-white hover:shadow-sm italic font-serif transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#3b3b3b">
                  <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 18c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-3H7V4h10v13z" />
                </svg>
                Continue with Phone
              </button>
            </div>
          ) : step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-[#3b3b3b] text-sm italic mb-2 font-serif">Phone number</label>
                <input type="tel" required placeholder="10 digit number (e.g., 9876543210)" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} maxLength="10" className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-[#9c7c3a] transition bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]" />
                <p className="text-[#999] text-xs italic mt-1 font-serif">Enter your 10-digit mobile number (India)</p>
              </div>

              <button type="submit" disabled={loading || phone.length < 10} className="w-full inline-flex items-center justify-center gap-2 bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-white disabled:text-[#666] font-light italic py-3 rounded-lg transition duration-200 mt-2 font-serif">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>

              <div className="text-center mt-3">
                <button type="button" onClick={() => { setStep('choice'); setPhone(''); setOtp(''); setIsExistingUser(null); setError(''); }} className="text-[#1922d2] italic font-serif text-sm hover:underline">
                  ← Back
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-[#3b3b3b] text-sm italic mb-2 font-serif">OTP</label>
                <input type="text" required placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength="6" className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-[#9c7c3a] transition bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]" />
              </div>

              <button type="submit" disabled={loading || otp.length < 6} className="w-full inline-flex items-center justify-center gap-2 bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-white disabled:text-[#666] font-light italic py-3 rounded-lg transition duration-200 mt-2 font-serif">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="text-center mt-3">
                <button type="button" onClick={() => { setStep('choice'); setPhone(''); setOtp(''); setIsExistingUser(null); setError(''); }} className="text-[#1922d2] italic font-serif text-sm hover:underline">Choose another sign-in method</button>
              </div>
            </form>
          )}



          <p className="text-center text-[#666] text-sm mt-6 italic font-serif">
            By signing in you agree to our terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;