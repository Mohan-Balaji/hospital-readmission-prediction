import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { toast } from 'sonner';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();

  // Show toast on hook error and stop local loading
  useEffect(() => {
    if (!error) return;
    if (error.code === 'auth/user-not-found') {
      toast.error('No user found for this email', { description: 'Please sign up first.' });
    } else if (error.code === 'auth/wrong-password') {
      toast.error('Incorrect password', { description: 'Please try again.' });
    } else if(error.message === 'Firebase: Error (auth/invalid-credential).') {
      toast.error('Invalid Credentials',{description:'Please enter correct email and password.'});
    }
    setLocalLoading(false);
  }, [error]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res) {
        sessionStorage.setItem('user', JSON.stringify(res.user.uid)); // store uid instead of just true
        setEmail('');
        setPassword('');
        navigate('/');
      }
    } catch (err) {
      if (err && err.code === 'auth/user-not-found') {
        toast.error('No user found for this email', { description: 'Please sign up first.' });
      } else if (err && err.code === 'auth/wrong-password') {
        toast.error('Incorrect password', { description: 'Please try again.' });
      } else {
        toast.error('Sign in failed', { description: 'Please check your credentials.' });
      }
      console.error(err);
    }
    finally {
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
              Welcome Back
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Sign in to your account to continue
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-10">
            <form className="space-y-8" onSubmit={handleSignIn}>
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter your password"
                />
                <div className="text-right mt-3">
                  <Link to="/forgot-password" className="text-lg text-blue-600 hover:text-blue-500 transition-colors duration-200 font-medium">
                    Forgot your password?
                  </Link>
                </div>
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
                        {error.code === 'auth/user-not-found' && 'No user found with this email. Please sign up first.'}
                        {error.code === 'auth/wrong-password' && 'Incorrect password. Please try again.'}
                        {error.code !== 'auth/user-not-found' && error.code !== 'auth/wrong-password' && 'Please enter correct email and password.'}
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
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-lg text-gray-600">
                Don't have an account?{' '}
                <Link to="/sign-up" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SignInPage;
