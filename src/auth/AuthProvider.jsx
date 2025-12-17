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
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  // Prevent repeated session calls for same uid (StrictMode/dev)
  const lastSessionUidRef = useRef(null);

  const clearUserSessionStorage = () => {
    // remove any per-user booking keys
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith("sd_booking_id_"))
      .forEach((k) => sessionStorage.removeItem(k));
  };

  const createSession = async (user) => {
    // ✅ always clear old token before issuing a new one
    localStorage.removeItem("sd_jwt");

    const idToken = await user.getIdToken(true);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/session`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );

    const text = await res.text();

    let data;
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

  // Safe to call; helps redirect sign-in finalize
  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setFbUser(user || null);

      try {
        // ✅ logged out
        if (!user) {
          localStorage.removeItem("sd_jwt");
          setDbUser(null);
          lastSessionUidRef.current = null;

          clearUserSessionStorage();

          setAuthReady(true);
          return;
        }

        // ✅ already have correct session for this firebase user
        const jwt = localStorage.getItem("sd_jwt");
        const hasCorrectDbUser = dbUser?.uid && dbUser.uid === user.uid;

        if (lastSessionUidRef.current === user.uid && jwt && hasCorrectDbUser) {
          setAuthReady(true);
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
        setAuthReady(true);
      }
    });

    return () => unsub();
  }, [dbUser]); // ✅ include dbUser so "hasCorrectDbUser" updates correctly

  const register = async ({ name, email, password, photoURL }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name || photoURL) {
      await updateProfile(cred.user, { displayName: name, photoURL });
    }
    return cred.user;
  };

  const login = async ({ email, password }) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithRedirect(auth, provider);
  };

  const logout = async () => {
    localStorage.removeItem("sd_jwt");
    setDbUser(null);
    lastSessionUidRef.current = null;

    clearUserSessionStorage();

    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      fbUser,
      user: dbUser,
      loading,
      authReady,
      register,
      login,
      googleLogin,
      logout,
    }),
    [fbUser, dbUser, loading, authReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
