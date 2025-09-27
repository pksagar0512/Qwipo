import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => setShowResend(true), 60000); // show after 1 min
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("OTP sent via SMS to your registered mobile number");
        setStep(2);
        setShowResend(false);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error, please try again.");
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        setMessage(`Welcome back, ${data.name}!`);
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        setMessage(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error during OTP verification.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("OTP resent via SMS");
        setShowResend(false);
      } else {
        setMessage(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error while resending OTP.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={step === 1 ? handleLogin : handleOtpVerify}
        className="bg-gray-700 p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          {step === 1 ? "Login" : "Enter OTP"}
        </h2>

        {step === 1 ? (
          <>
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
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
              required
            />
            {showResend && (
              <button
                type="button"
                onClick={handleResendOtp}
                className="w-full bg-yellow-500 py-2 rounded text-white font-semibold hover:bg-yellow-600 mb-4"
              >
                Resend OTP
              </button>
            )}
          </>
        )}

        <button
          type="submit"
          className="w-full bg-purple-500 py-2 rounded text-white font-semibold hover:bg-purple-600"
        >
          {step === 1 ? "Send OTP" : "Verify OTP"}
        </button>

        {message && <p className="mt-4 text-center text-green-400">{message}</p>}
      </form>
    </div>
  );
}