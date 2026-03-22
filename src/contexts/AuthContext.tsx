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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

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

  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

      if (!cleanUsername) {
        throw new Error("Username is required");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const newUser = userCredential.user;

      /* Set Firebase display name */
      await updateProfile(newUser, {
        displayName: cleanUsername,
      });

      /* Save user profile in Firestore */
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

  /* 🚪 SIGN OUT */
  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* Hook */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}