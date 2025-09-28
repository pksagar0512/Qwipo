import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [role, setRole] = useState("");
  const [retailerType, setRetailerType] = useState("");
  const [brandName, setBrandName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [category, setCategory] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Format number to +91XXXXXXXXXX
  const formatWhatsapp = (number) => {
    let num = number.trim();
    if (num.startsWith("0")) num = num.slice(1);
    if (!num.startsWith("+91")) num = "+91" + num;
    return num;
  };

  const handlePreRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!role) {
      setError("Please select your role");
      setLoading(false);
      return;
    }

    if (!/^\d{10,12}$/.test(whatsapp)) {
      setError("Please enter a valid WhatsApp number");
      setLoading(false);
      return;
    }

    if (role === "manufacturer" && (!brandName || !gstNumber || !category)) {
      setError("Please fill all manufacturer fields");
      setLoading(false);
      return;
    }

    if (role === "retailer" && !retailerType) {
      setError("Please select your retailer type");
      setLoading(false);
      return;
    }

    try {
      const formattedWhatsapp = formatWhatsapp(whatsapp);

      const res = await fetch("http://localhost:5000/api/users/pre-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          whatsapp: formattedWhatsapp,
          role,
          brandName,
          gstNumber,
          category,
          retailerType,
        }),
      });

      const data = await res.json();
      console.log("Pre-register response:", data);

      if (res.ok) {
        setMessage("✅ OTP sent to your WhatsApp. Please verify.");
        setStep(2);
      } else {
        setError(data.message || "Pre-registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
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
      const formattedWhatsapp = formatWhatsapp(whatsapp);

      const res = await fetch("http://localhost:5000/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      console.log("Verify OTP response:", data);

      if (res.ok) {
        setMessage("✅ Registration complete! Opening WhatsApp…");

        window.open(
          `https://wa.me/${formattedWhatsapp}?text=Hi! Please confirm your subscription to Qwipo product alerts.`,
          "_blank"
        );

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error("OTP error:", err);
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
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white" required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white" required />
            <input type="tel" placeholder="WhatsApp Number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white" required />

            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white" required>
              <option value="">Select Role</option>
              <option value="retailer">Retailer</option>
              <option value="manufacturer">Manufacturer</option>
            </select>

            {role === "retailer" && (
              <select value={retailerType} onChange={(e) => setRetailerType(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white" required>
                <option value="">Select Retailer Type</option>
                <option value="Grocery">Grocery</option>
                <option value="Electrical">Electrical</option>
                <option value="Clothing">Clothing</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Stationery">Stationery</option>
                <option value="Footwear">Footwear</option>
                <option value="Cosmetics">Cosmetics</option>
                <option value="Mobile Accessories">Mobile Accessories</option>
                <option value="Furniture">Furniture</option>
              </select>
            )}

            {role === "manufacturer" && (
              <>
                <input type="text" placeholder="Brand Name" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white" required />
                <input type="text" placeholder="GST Number" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white" required />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white" required>
                  <option value="">Select Category</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Cosmetics">Cosmetics</option>
                  <option value="Mobile Accessories">Mobile Accessories</option>
                </select>
              </>
            )}
          </>
        )}

        {step === 2 && (
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white" required />
        )}

        <button type="submit" disabled={loading} className={`w-full py-2 rounded text-white font-semibold ${loading ? "bg-emerald-400" : "bg-emerald-500 hover:bg-emerald-600"}`}>
          {loading ? "Processing..." : step === 1 ? "Send OTP" : "Verify & Register"}
        </button>

        {message && <p className="mt-4 text-center text-green-400">{message}</p>}
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      </form>
    </div>
  );
}
