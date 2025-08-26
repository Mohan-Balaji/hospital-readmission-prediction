import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let auth;

try {
  // Check if Firebase config is available
  if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);

    // IMPORTANT: Only connect to emulator in development AND if emulator is running
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      try {
        // Check if emulator is already connected
        if (!auth._delegate?._emulator) {
          connectAuthEmulator(auth, 'http://localhost:9099');
          console.log('Connected to Firebase Auth Emulator');
        }
      } catch (emulatorError) {
        console.warn('Could not connect to Firebase Auth Emulator:', emulatorError);
        console.warn('Using production Firebase Auth instead');
      }
    }

    // Configure auth settings
    if (auth?.settings) {
      // Only disable app verification in development with emulator
      if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
        auth.settings.appVerificationDisabledForTesting = true;
        console.log('App verification disabled for testing (development with emulator only)');
      } else {
        // Ensure it's enabled for production
        auth.settings.appVerificationDisabledForTesting = false;
      }
    }

    console.log('Firebase initialized successfully');
    console.log('Environment:', import.meta.env.DEV ? 'Development' : 'Production');
    console.log('Auth Domain:', firebaseConfig.authDomain);
  } else {
    throw new Error('Firebase configuration is incomplete');
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error);
  console.warn('Please check your .env file and ensure all Firebase configuration variables are set');
  
  // Create a mock auth object for development/testing
  auth = createMockAuth();
  app = { name: 'fallback-app' };
}

// Mock auth object for development/testing when Firebase is not configured
function createMockAuth() {
  const listeners = [];
  let currentUser = null;

  // Check if user is stored in sessionStorage
  if (typeof window !== 'undefined') {
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        currentUser = { uid: storedUser };
      }
    } catch (e) {
      console.warn('Could not access sessionStorage:', e);
    }
  }

  return {
    currentUser,
    onAuthStateChanged: (callback) => {
      listeners.push(callback);
      callback(currentUser);
      return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
    signInWithEmailAndPassword: async (email, password) => {
      // Demo credentials for testing
      if (email === 'demo@example.com' && password === 'demo123') {
        const user = { uid: 'demo-user-id', email };
        currentUser = user;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('user', user.uid);
        }
        listeners.forEach(callback => callback(user));
        return { user };
      }
      throw new Error('auth/invalid-credential');
    },
    createUserWithEmailAndPassword: async (email, password) => {
      // Simulate successful registration
      const user = { uid: `user-${Date.now()}`, email };
      currentUser = user;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', user.uid);
      }
      listeners.forEach(callback => callback(user));
      return { user };
    },
    signOut: async () => {
      currentUser = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('user');
      }
      listeners.forEach(callback => callback(null));
    },
    sendPasswordResetEmail: async (email) => {
      // Simulate password reset email
      console.log('Password reset email would be sent to:', email);
      return Promise.resolve();
    },
  };
}

export { app, auth };