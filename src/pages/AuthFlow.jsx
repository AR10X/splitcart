import { useEffect, useRef, useState } from "react";
import { sendOtp, verifyOtp, toE164India } from "../lib/firebase";
import AuthIllustration from "../assets/auth-illustration.svg"; // put an SVG here

const TERMS_URL = "/legal/terms";
const PRIVACY_URL = "/legal/privacy";

// --- DEMO SETTINGS ---
const DEMO_NUMBERS = ["+919876543210", "+911234567890"];
const DEMO_OTP = "123456";

export default function AuthFlow({ onDone }) {
  const [stage, setStage] = useState("phone"); // "phone" | "otp" | "name"
  const [phone, setPhone] = useState("");
  const [name, setName] = useState(localStorage.getItem("sc_name") || "");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // --- 6-digit OTP state/refs ---
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = Array.from({ length: 6 }, () => useRef(null));
  const nameRef = useRef(null);

  useEffect(() => {
    if (stage === "otp") otpRefs[0].current?.focus();
    if (stage === "name") nameRef.current?.focus();
  }, [stage]);

  // send
  async function handleSendOtp(e) {
    e.preventDefault();
    try {
      setErr(""); 
      setLoading(true);

      const e164 = toE164India(phone);

      // --- DEMO restriction: allow only test numbers ---
      if (!DEMO_NUMBERS.includes(e164)) {
        throw new Error(
          `Demo mode: Only test numbers 9876543210 or 1234567890 can be used`
        );
      }

      await sendOtp(e164);
      setPhone(e164);

      // --- DEMO: prefill OTP ---
      setOtp(DEMO_OTP.split("")); // ["1","2","3","4","5","6"]

      setStage("otp");
    } catch (e) { 
      setErr(e.message || "Failed to send OTP"); 
    }
    finally { 
      setLoading(false); 
    }
  }


  // verify
  async function handleVerify(e) {
    e.preventDefault();
    try {
      setErr(""); setLoading(true);
      const code = otp.join("");
      await verifyOtp(code);
      if (!localStorage.getItem("sc_name")) setStage("name");
      else onDone?.();
    } catch (e) { setErr(e.message || "Invalid OTP"); }
    finally { setLoading(false); }
  }

  // save name
  function handleSaveName(e) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return setErr("Please enter your name");
    localStorage.setItem("sc_name", n);
    onDone?.();
  }

  function back() {
    setErr("");
    if (stage === "otp") setStage("phone");
    else if (stage === "name") setStage("otp");
  }

  // --- OTP handlers ---
  function onOtpChange(i, val) {
    const v = val.replace(/\D/g, "").slice(0, 1);
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) otpRefs[i + 1].current?.focus();
  }
  function onOtpKeyDown(i, e) {
    if (e.key === "Backspace") {
      if (otp[i]) { const n = [...otp]; n[i] = ""; setOtp(n); }
      else if (i > 0) { otpRefs[i - 1].current?.focus(); }
    } else if (e.key === "ArrowLeft" && i > 0) otpRefs[i - 1].current?.focus();
    else if (e.key === "ArrowRight" && i < 5) otpRefs[i + 1].current?.focus();
  }
  function onOtpPaste(e) {
    const t = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (!t) return;
    e.preventDefault();
    const arr = t.split(""); while (arr.length < 6) arr.push("");
    setOtp(arr);
    otpRefs[Math.min(t.length, 5)].current?.focus();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-10">
      {/* Illustration + logo */}
      <img src={AuthIllustration} alt="" className="w-48 sm:w-64 mb-6" />
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl sm:text-4xl font-bold">
          <span className="text-gray-900">Split</span>
          <span className="text-green-600">Cart</span>
        </span>
        <span className="text-green-600 text-2xl" aria-hidden>🛒</span>
      </div>
      <p className="text-green-600 font-medium mb-2">Groceries, split easy 🚀</p>

      {/* --- DEMO NOTICE (below subtitle, above form) --- */}
      <div className="w-full max-w-xs mb-6 rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-gray-800">
        <p className="font-semibold text-green-800">Demo login (free Firebase tier)</p>
        <p className="mt-1">
          Phone login works only with these test numbers:&nbsp;
          <code className="font-mono">9876543210</code> or <code className="font-mono">1234567890</code>.
          OTP is always <code className="font-mono">{DEMO_OTP}</code>.
        </p>
      </div>

      {/* Step dots */}
      <div className="flex gap-1.5 mb-6" aria-hidden>
        {["phone","otp","name"].map(s => (
          <span key={s} className={`w-2 h-2 rounded-full ${stage===s ? "bg-green-600" : "bg-gray-300"}`} />
        ))}
      </div>

      {/* PHONE */}
      {stage === "phone" && (
        <form onSubmit={handleSendOtp} className="w-full max-w-xs">
          <div className="flex items-center border rounded-full px-4 py-3 mb-3 bg-white">
            <span className="text-gray-600 mr-2">+91</span>
            <input
              className="flex-1 outline-none "
              placeholder="9876543210"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              inputMode="tel"
              autoComplete="tel"
            />
          </div>
          {err && <p className="text-red-500 text-sm mb-2 text-center">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-full active:scale-95 transition"
          >
            {loading ? "Sending…" : "Send OTP"}
          </button>
          <p className="mt-4 text-xs text-gray-500 text-center">
            By continuing, you agree to our{" "}
            <a href={TERMS_URL} className="text-green-600 underline">Terms of Service</a>{" "}
            and{" "}
            <a href={PRIVACY_URL} className="text-green-600 underline">Privacy Policy</a>.
          </p>
          <div id="recaptcha-container" className="sr-only" />
        </form>
      )}

      {/* OTP (6 boxes) */}
      {stage === "otp" && (
        <form onSubmit={handleVerify} className="w-full max-w-xs flex flex-col items-center">
          <p className="text-sm text-gray-600 mb-3 text-center">
            Enter the 6-digit code sent to <b>{phone}</b>
          </p>

          <div className="flex gap-2 mb-3" onPaste={onOtpPaste}>
            {otp.map((d, i) => (
              <input
                key={i}
                ref={otpRefs[i]}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={d}
                onChange={(e)=>onOtpChange(i, e.target.value)}
                onKeyDown={(e)=>onOtpKeyDown(i, e)}
                className="w-12 h-12 text-center text-xl font-medium border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            ))}
          </div>

          {/* DEMO hint under the OTP boxes when applicable */}
          {DEMO_NUMBERS.includes(phone) && (
            <p className="text-xs text-gray-500 mb-2">
              Demo number detected — OTP is prefilled as <code className="font-mono">{DEMO_OTP}</code>.
            </p>
          )}

          {err && <p className="text-red-500 text-sm mb-2">{err}</p>}

          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-full active:scale-95 transition mb-2"
          >
            {loading ? "Verifying…" : "Verify"}
          </button>
          <button
            type="button"
            onClick={back}
            className="w-full border rounded-full py-3 text-gray-700 bg-white"
          >
            Back
          </button>
        </form>
      )}

      {/* NAME */}
      {stage === "name" && (
        <form onSubmit={handleSaveName} className="w-full max-w-xs">
          <input
            ref={nameRef}
            className="w-full border rounded-full px-4 py-3 mb-3 bg-white outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Your name (e.g., Abdul)"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            autoComplete="name"
          />
          {err && <p className="text-red-500 text-sm mb-2">{err}</p>}
          <div className="flex flex-col gap-2">
            <button type="submit" className="w-full bg-green-600 text-white font-semibold py-3 rounded-full active:scale-95 transition">
              Continue
            </button>
            <button type="button" onClick={back} className="w-full border rounded-full py-3 text-gray-700 bg-white">
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
