// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(cfg);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
auth.useDeviceLanguage?.();

/** Dev: bypass requires you STILL pass a verifier, but no challenge is shown. */
if (import.meta.env.DEV) {
  auth.settings.appVerificationDisabledForTesting = true; // works only with test numbers
}

/** ensure a DOM container exists (we create one if missing) */
function ensureContainer(id = "recaptcha-container") {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.style.position = "absolute";
    el.style.left = "-9999px"; // keep offscreen
    document.body.appendChild(el);
  }
  return id;
}

/** Always create a fresh invisible RecaptchaVerifier */
function makeVerifier(containerId = "recaptcha-container") {
  const id = ensureContainer(containerId);
  if (window.recaptchaVerifier) {
    try { window.recaptchaVerifier.clear?.(); } catch {}
    window.recaptchaVerifier = null;
  }
  window.recaptchaVerifier = new RecaptchaVerifier(auth, id, { size: "invisible" });
  return window.recaptchaVerifier;
}

export async function sendOtp(e164Phone) {
  try {
    const phone = String(e164Phone || "").trim();
    if (!/^\+\d{10,15}$/.test(phone)) throw new Error("Use E.164 format like +91XXXXXXXXXX");

    const verifier = makeVerifier(); // ALWAYS pass a verifier
    const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
    window.confirmationResult = confirmation;
    return true;
  } catch (e) {
    console.error("sendOtp error:", e.code, e.message, e);
    throw e;
  }
}

export async function verifyOtp(code) {
  try {
    if (!window.confirmationResult) throw new Error("No OTP session. Request a new code.");
    const trimmed = String(code || "").trim();
    if (!/^\d{6}$/.test(trimmed)) throw new Error("Code must be 6 digits.");

    const cred = await window.confirmationResult.confirm(trimmed);
    window.confirmationResult = null;
    try { window.recaptchaVerifier?.clear?.(); } catch {}
    window.recaptchaVerifier = null;
    return cred.user;
  } catch (e) {
    console.error("verifyOtp error:", e.code, e.message, e);
    throw e;
  }
}

export function onAuth(cb) { return onAuthStateChanged(auth, cb); }
export function logout() { return signOut(auth); }

/** +91 helpers */
export function toE164India(raw) {
  const d = String(raw || "").replace(/\D/g, "");
  if (d.length === 10) return `+91${d}`;
  if (raw.startsWith("+") && /^\+\d{10,15}$/.test(raw)) return raw;
  throw new Error("Enter a valid Indian number, e.g. 9876543210");
}
