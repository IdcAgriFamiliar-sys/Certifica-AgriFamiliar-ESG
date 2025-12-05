import React, { createContext, useContext, useState, useEffect } from "react";
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
    // For email/password login, we'd need to implement that in auth.ts too if we want to support it.
    // But the requirements emphasize Google Login for Farmers.
    // Admins might use email/password.
    // For now, let's keep it simple or implement a basic Firebase email login if needed.
    // Assuming admin accounts are created manually in Firebase Console or via a script.
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
    await firebaseSignOut(auth);
    setUser(null);
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
