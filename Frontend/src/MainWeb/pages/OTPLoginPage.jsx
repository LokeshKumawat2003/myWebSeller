import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOTPRegister, sendOTPLogin, verifyOTPRegister, verifyOTPLogin, setAuthToken, API_URL } from '../../services/api';

const OTPLoginPage = () => {
  const [step, setStep] = useState('choice'); // choice, phone, otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(null); // null=unknown, true=login, false=register
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  // Resend OTP timer
  const startTimer = () => {
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
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Auto-detect: try login first, if user not found -> register
      try {
        await sendOTPLogin({ phone });
        setIsExistingUser(true);
      } catch (err) {
        // If login send fails with 404 / not found, treat as new user
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
      startTimer();
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
      // Verify according to detected mode
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
            <h1 className="text-3xl font-light italic text-[#9c7c3a] mb-2 font-serif">kalaqx</h1>
            <p className="text-[#666] italic font-serif">
              {step === 'choice' ? 'Choose sign-in method' : (step === 'phone' ? 'Sign in or create account with phone' : 'Enter OTP')}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#e6ddd2] border border-[#9c7c3a] text-[#3b3b3b] rounded-lg text-sm italic font-serif">
              {error}
            </div>
          )}

          {step === 'choice' ? (
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = `${API_URL}/auth/google`}
                className="w-full bg-white border border-[#e6ddd2] text-[#3b3b3b] py-3 rounded-lg hover:shadow-sm font-serif"
              >
                Continue with Google
              </button>
              <button
                onClick={() => { setStep('phone'); setError(''); setPhone(''); }}
                className="w-full bg-[#9c7c3a] hover:bg-[#8a6a2f] text-white font-light italic py-3 rounded-lg transition duration-200 font-serif"
              >
                Continue with Phone
              </button>
            </div>
          ) : step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-[#3b3b3b] text-sm italic mb-2 font-serif">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="10 digit number (e.g., 9876543210)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength="10"
                  className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-[#9c7c3a] transition bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]"
                />
                <p className="text-[#999] text-xs italic mt-1 font-serif">Enter your 10-digit mobile number (India)</p>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-white disabled:text-[#666] font-light italic py-3 rounded-lg transition duration-200 mt-2 font-serif"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              {/* OTP input only - no password fields */}

              <div>
                <label className="block text-[#3b3b3b] text-sm italic mb-2 font-serif">OTP</label>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength="6"
                  className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-[#9c7c3a] transition bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-white disabled:text-[#666] font-light italic py-3 rounded-lg transition duration-200 mt-2 font-serif"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  disabled={timer > 0}
                  className="text-[#1922d2] italic font-serif text-sm hover:underline disabled:text-[#999] disabled:no-underline"
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => { setStep('choice'); setError(''); setPhone(''); setOtp(''); setIsExistingUser(null); }}
              className="text-[#1922d2] italic font-serif text-sm hover:underline"
            >
              Choose another sign-in method
            </button>
          </div>

          <div className="text-center mt-4 border-t border-[#e6ddd2] pt-4">
            <a
              href="/login"
              className="text-[#666] italic font-serif text-sm hover:text-[#9c7c3a]"
            >
              ← Back to regular login
            </a>
          </div>

          <p className="text-center text-[#666] text-sm mt-4 italic font-serif">
            By signing in you agree to our terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPLoginPage;
