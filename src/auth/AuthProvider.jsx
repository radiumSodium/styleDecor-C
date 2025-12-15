import { createContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [fbUser, setFbUser] = useState(null);
  const [dbUser, setDbUser] = useState(null); // has role
  const [loading, setLoading] = useState(true);

  // Create/refresh backend session (get JWT + role)
  const createSession = async (user) => {
    const idToken = await user.getIdToken(true);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/session`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );

    const data = await res.json();
    if (!data?.ok) throw new Error(data?.message || "Session failed");

    localStorage.setItem("sd_jwt", data.token);
    setDbUser(data.user);
    return data.user;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        setFbUser(user || null);

        if (!user) {
          localStorage.removeItem("sd_jwt");
          setDbUser(null);
          return;
        }

        await createSession(user);
      } catch (e) {
        console.error(e);
        localStorage.removeItem("sd_jwt");
        setDbUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const register = async ({ name, email, password, photoURL }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name || photoURL) {
      await updateProfile(cred.user, { displayName: name, photoURL });
    }
    // onAuthStateChanged will create session automatically
    return cred.user;
  };

  const login = async ({ email, password }) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  };

  const logout = async () => {
    localStorage.removeItem("sd_jwt");
    setDbUser(null);
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      fbUser,
      user: dbUser, // this has role
      loading,
      register,
      login,
      googleLogin,
      logout,
    }),
    [fbUser, dbUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
