import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { toast } from 'sonner';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email required', { description: 'Please enter your email address.' });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!', { description: 'Check your inbox for reset instructions.' });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        toast.error('No user found', { description: 'No account exists with this email address.' });
      } else {
        toast.error('Failed to send reset email', { description: 'Please try again later.' });
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <ProtectedRoute requireAuth={false}>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg w-full space-y-10">
            <div className="text-center">
              <div className="mx-auto h-28 w-28 bg-green-100 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                <svg className="h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="mt-10 text-4xl font-bold text-gray-900">
                Check Your Email
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                We've sent password reset instructions to your email
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-10">
              <div className="text-center space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-lg text-green-800">
                        Password reset email sent successfully!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-lg text-gray-600">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  
                  <button
                    onClick={() => setSuccess(false)}
                    className="w-full py-4 px-6 border border-gray-300 rounded-xl shadow-lg text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:ring-3 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Try Again
                  </button>
                  
                  <Link
                    to="/sign-in"
                    className="block w-full py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:ring-3 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-10">
          <div className="text-center">
            <div className="mx-auto h-28 w-28 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white">
              <img src="/images/logo.jpg" alt="Logo" className="h-16 w-16 object-contain rounded-full" />
            </div>
            <h2 className="mt-10 text-4xl font-bold text-gray-900">
              Reset Password
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Enter your email to receive reset instructions
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-10">
            <form className="space-y-8" onSubmit={handleForgotPassword}>
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-3">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:ring-3 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Email'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                to="/sign-in"
                className="text-lg text-blue-600 hover:text-blue-500 transition-colors duration-200 font-semibold"
              >
                ← Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ForgotPasswordPage;
