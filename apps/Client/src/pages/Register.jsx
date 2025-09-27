import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = pre-register, 2 = verify OTP

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePreRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!/^\d{10,12}$/.test(whatsapp)) {
      setError("Please enter a valid WhatsApp number");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/pre-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, whatsapp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("OTP sent to your mobile. Please verify.");
        setStep(2);
      } else {
        setError(data.message || "Pre-registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registration complete! Opening WhatsApp…");

        const formattedNumber = whatsapp.startsWith("91") ? whatsapp : `91${whatsapp}`;
        window.open(
          `https://wa.me/${formattedNumber}?text=Hi! Please confirm your subscription to Weepo product alerts.`,
          "_blank"
        );

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={step === 1 ? handlePreRegister : handleVerifyOtp}
        className="bg-gray-700 p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          {step === 1 ? "Register" : "Verify OTP"}
        </h2>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
              required
            />
            <input
              type="tel"
              placeholder="WhatsApp Number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
              required
            />
          </>
        )}

        {step === 2 && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
            required
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold ${
            loading ? "bg-emerald-400" : "bg-emerald-500 hover:bg-emerald-600"
          }`}
        >
          {loading ? "Processing..." : step === 1 ? "Send OTP" : "Verify & Register"}
        </button>

        {message && <p className="mt-4 text-center text-green-400">{message}</p>}
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      </form>
    </div>
  );
}