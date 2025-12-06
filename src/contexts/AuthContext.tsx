import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../services/firebase";
import { signInWithGoogle, getUserProfile, UserProfile } from "../services/auth";
import type { UserRole } from "../types";

export type User = UserProfile;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDev?: () => Promise<void>;
  logout: () => Promise<void>;
  isAllowed: (roles: UserRole[] | UserRole) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check for Dev Admin Override
        if (sessionStorage.getItem('DEV_ADMIN_MODE') === 'true') {
          setUser({
            uid: firebaseUser.uid,
            email: "admin@dev.com",
            displayName: "Dev Admin",
            photoURL: "",
            role: "admin"
          });
          setLoading(false);
          return;
        }

        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUser(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, senha: string) => {
    await signInWithEmailAndPassword(auth, email, senha);
  };

  const loginWithGoogleContext = async () => {
    try {
      const profile = await signInWithGoogle();
      setUser(profile);
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    sessionStorage.removeItem('DEV_ADMIN_MODE');
    await firebaseSignOut(auth);
    setUser(null);
  };

  const loginAsDev = async () => {
    // DEV ONLY: Set flag and sign in anonymously
    try {
      // Ensure we start from a clean slate
      await firebaseSignOut(auth);
      sessionStorage.setItem('DEV_ADMIN_MODE', 'true');

      // Wait a tiny bit to ensure auth state clears if needed, 
      // though await signOut should be enough.

      await import("firebase/auth").then(m => m.signInAnonymously(auth));

      // Force a state update if onAuthStateChanged doesn't trigger (rare but possible with race conditions)
      // logic handled by listener, but if we are already anonymous, listener might not fire?
      // signOut() above guarantees it will fire (null -> user).
    } catch (e) {
      console.error("Dev Login Error", e);
      sessionStorage.removeItem('DEV_ADMIN_MODE');
    }
  };

  const isAllowed = (roles: UserRole[] | UserRole) => {
    if (!user) return false;
    const arr = Array.isArray(roles) ? roles : [roles];
    return arr.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginWithGoogle: loginWithGoogleContext,
      loginAsDev,
      logout,
      isAllowed
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
