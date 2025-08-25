import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // User is not authenticated but route requires auth
        navigate('/sign-in');
      } else if (!requireAuth && user) {
        // User is authenticated but route doesn't require auth (like sign-in/sign-up)
        navigate('/');
      }
    }
  }, [user, loading, requireAuth, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Show children if authentication requirements are met
  if ((requireAuth && user) || (!requireAuth && !user)) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
};

export default ProtectedRoute;
