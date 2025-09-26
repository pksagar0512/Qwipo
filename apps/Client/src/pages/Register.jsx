import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registered successfully! Now you can login.");
        setName("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error, please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-700 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Register</h2>

        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white" required />

        <button type="submit" className="w-full bg-emerald-500 py-2 rounded text-white font-semibold hover:bg-emerald-600">Register</button>

        {message && <p className="mt-4 text-center text-green-400">{message}</p>}
      </form>
    </div>
  );
}