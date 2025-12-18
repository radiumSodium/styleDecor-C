import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const [dbUser, setDbUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  const lastSessionUidRef = useRef(null);

  const clearUserSessionStorage = useCallback(() => {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith("sd_booking_id_"))
      .forEach((k) => sessionStorage.removeItem(k));
  }, []);

  const createSession = useCallback(async (firebaseUser) => {
    // always clear old token
    localStorage.removeItem("sd_jwt");

    const idToken = await firebaseUser.getIdToken(true);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/session`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      throw new Error(data?.message || `Session failed (${res.status})`);
    }

    localStorage.setItem("sd_jwt", data.token);
    setDbUser(data.user);
    return data.user;
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
          clearUserSessionStorage();
          return;
        }

        const jwt = localStorage.getItem("sd_jwt");
        const hasCorrectDbUser = dbUser?.uid && dbUser.uid === user.uid;

        // already have session for this uid
        if (jwt && hasCorrectDbUser && lastSessionUidRef.current === user.uid) {
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
    // keep dependency light but correct
  }, [dbUser?.uid, clearUserSessionStorage, createSession]);

  const register = useCallback(
    async ({ name, email, password, photoURL }) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      if (name || photoURL) {
        await updateProfile(cred.user, { displayName: name, photoURL });
      }

      // ✅ create backend session immediately
      await createSession(cred.user);

      return cred.user;
    },
    [createSession]
  );

  const login = useCallback(
    async ({ email, password }) => {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // ✅ create backend session immediately
      await createSession(cred.user);

      return cred.user;
    },
    [createSession]
  );

  const googleLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    // ✅ popup is reliable in local + deployed
    const cred = await signInWithPopup(auth, provider);

    // ✅ create backend session immediately
    await createSession(cred.user);

    return cred.user;
  }, [createSession]);

  const logout = useCallback(async () => {
    localStorage.removeItem("sd_jwt");
    setDbUser(null);
    lastSessionUidRef.current = null;
    clearUserSessionStorage();
    await signOut(auth);
  }, [clearUserSessionStorage]);

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
    [fbUser, dbUser, loading, authReady, register, login, googleLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
