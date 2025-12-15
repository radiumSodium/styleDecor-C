import { createContext, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [fbUser, setFbUser] = useState(null);
  const [dbUser, setDbUser] = useState(null); // role-based user from DB
  const [loading, setLoading] = useState(true);

  // Prevent repeated session calls for same uid (useful in StrictMode/dev)
  const lastSessionUidRef = useRef(null);

  const createSession = async (user) => {
    const idToken = await user.getIdToken(true);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/session`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    const text = await res.text();

    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Non-JSON response from server:", text.slice(0, 300));
      throw new Error(
        `Server returned non-JSON (${res.status}). Check backend logs.`
      );
    }

    if (!res.ok || !data?.ok) {
      throw new Error(data?.message || `Session failed (${res.status})`);
    }

    localStorage.setItem("sd_jwt", data.token);
    setDbUser(data.user);

    return data.user;
  };

  // Handle Google redirect result once (safe; doesn't break email/pass flow)
  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setFbUser(user || null);

      try {
        if (!user) {
          localStorage.removeItem("sd_jwt");
          setDbUser(null);
          lastSessionUidRef.current = null;
          return;
        }

        // Avoid hitting /session multiple times for same signed-in user
        if (lastSessionUidRef.current === user.uid && dbUser) {
          return;
        }

        lastSessionUidRef.current = user.uid;
        await createSession(user);
      } catch (e) {
        console.error("Auth session error:", e);
        localStorage.removeItem("sd_jwt");
        setDbUser(null);
        lastSessionUidRef.current = null;
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
    // dbUser included so "avoid repeat" condition can work after first session
  }, [dbUser]);

  const register = async ({ name, email, password, photoURL }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name || photoURL) {
      await updateProfile(cred.user, { displayName: name, photoURL });
    }
    // session will be created by onAuthStateChanged
    return cred.user;
  };

  const login = async ({ email, password }) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  // ✅ Redirect-based Google login (no popup COOP warning)
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    // optional: always prompt account selection
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithRedirect(auth, provider);
  };

  const logout = async () => {
    localStorage.removeItem("sd_jwt");
    setDbUser(null);
    lastSessionUidRef.current = null;
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      fbUser,
      user: dbUser, // your DB user with role
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
