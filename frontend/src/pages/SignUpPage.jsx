import { useState, useEffect } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { toast } from 'sonner';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();

  // Show toast on hook error and stop local loading
  useEffect(() => {
    if (!error) return;
    if (error.code === 'auth/email-already-in-use') {
      toast.error('Email already in use', { description: 'Please sign in instead.' });
    } else if (error.code === 'auth/weak-password') {
      toast.error('Weak password', { description: 'Password should be at least 6 characters.' });
    } else if (error.code === 'auth/invalid-email') {
      toast.error('Invalid email', { description: 'Please enter a valid email address.' });
    }
    setLocalLoading(false);
  }, [error]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', { description: 'Please make sure both passwords are the same.' });
      return;
    }

    if (password.length < 6) {
      toast.error('Password too short', { description: 'Password should be at least 6 characters long.' });
      return;
    }

    setLocalLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      if (res) {
        sessionStorage.setItem('user', JSON.stringify(res.user.uid));
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        toast.success('Account created successfully!', { description: 'Welcome to Hospital Readmissions!' });
        navigate('/dashboard');
      }
    } catch (err) {
      if (err && err.code === 'auth/email-already-in-use') {
        toast.error('Email already in use', { description: 'Please sign in instead.' });
      } else if (err && err.code === 'auth/weak-password') {
        toast.error('Weak password', { description: 'Password should be at least 6 characters.' });
      } else if (err && err.code === 'auth/invalid-email') {
        toast.error('Invalid email', { description: 'Please enter a valid email address.' });
      } else {
        toast.error('Sign up failed', { description: 'Please check your information and try again.' });
      }
      console.error(err);
    } finally {
      if (!error) setLocalLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-10">
          <div className="text-center">
            <div className="mx-auto h-28 w-28 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white">
              <img src="/images/logo.jpg" alt="Logo" className="h-16 w-16 object-contain rounded-full" />
            </div>
            <h2 className="mt-10 text-4xl font-bold text-gray-900">
              Create Account
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Join our healthcare analytics platform
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-10">
            <form className="space-y-8" onSubmit={handleSignUp}>
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
              
              <div>
                <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-3">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Create a password (min 6 characters)"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-3">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Confirm your password"
                />
              </div>

              {/* Error Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-lg text-red-800">
                        {error.code === 'auth/email-already-in-use' && 'Email already in use. Please sign in instead.'}
                        {error.code === 'auth/weak-password' && 'Password should be at least 6 characters long.'}
                        {error.code === 'auth/invalid-email' && 'Please enter a valid email address.'}
                        {error.code !== 'auth/email-already-in-use' && error.code !== 'auth/weak-password' && error.code !== 'auth/invalid-email' && 'Please check your information and try again.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={(loading || localLoading) && !error}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:ring-3 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {(loading || localLoading) && !error ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-lg text-gray-600">
                Already have an account?{' '}
                <Link to="/sign-in" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SignUpPage;
