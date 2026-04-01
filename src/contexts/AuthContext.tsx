import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  User,
  updateProfile,
  updateEmail,
  updatePassword,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

/* ================= TYPES ================= */

interface AuthContextType {
  user: User | null;
  isLoading: boolean;

  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ error: Error | null }>;

  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;

  signInWithGoogle: () => Promise<{ error: Error | null }>;

  signOut: () => Promise<void>;

  /* ✅ NEW SETTINGS FUNCTIONS */
  updateUsername: (name: string) => Promise<void>;
  changeEmail: (newEmail: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  isGoogleUser: boolean;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* 🔐 Listen for auth state */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  /* 🟢 SIGN UP */
  const signUp = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      const cleanEmail = email.trim();
      const cleanUsername = username.trim();

      if (!cleanUsername) throw new Error("Username is required");
      if (password.length < 6)
        throw new Error("Password must be at least 6 characters");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const newUser = userCredential.user;

      await updateProfile(newUser, {
        displayName: cleanUsername,
      });

      await setDoc(doc(db, "users", newUser.uid), {
        username: cleanUsername,
        email: newUser.email,
        createdAt: serverTimestamp(),
        plan: "free",
      });

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  /* 🔑 SIGN IN */
  const signIn = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim();
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  /* 🔥 GOOGLE SIGN IN */
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          username: user.displayName,
          email: user.email,
          createdAt: serverTimestamp(),
          plan: "free",
        },
        { merge: true }
      );

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  /* 🚪 SIGN OUT */
  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  /* ================= SETTINGS FUNCTIONS ================= */

  /* ✏️ Update Username */
  const updateUsername = async (name: string) => {
    if (!user) return;

    await updateProfile(user, {
      displayName: name,
    });

    await updateDoc(doc(db, "users", user.uid), {
      username: name,
    });
  };

  /* 📧 Change Email */
  const changeEmail = async (newEmail: string) => {
    if (!user) return;

    await updateEmail(user, newEmail);

    await updateDoc(doc(db, "users", user.uid), {
      email: newEmail,
    });
  };

  /* 🔑 Change Password */
  const changePassword = async (newPassword: string) => {
    if (!user) return;

    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    await updatePassword(user, newPassword);
  };

  /* 🚪 Logout All Devices */
  const logoutAllDevices = async () => {
    await firebaseSignOut(auth);
  };

  /* 🔗 Check Google Provider */
  const isGoogleUser =
    user?.providerData?.some((p) => p.providerId === "google.com") || false;

  /* ================= RETURN ================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,

        /* ✅ NEW */
        updateUsername,
        changeEmail,
        changePassword,
        logoutAllDevices,
        isGoogleUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}