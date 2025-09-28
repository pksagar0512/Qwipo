import React, { useState } from "react";

export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    
    const contactData = { firstName, lastName, email, phone, message };
    console.log("Contact query submitted:", contactData);

    setStatus("Your query has been sent! We will reach out to you soon.");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="pt-24 flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-700 dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-1/2 px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:border-indigo-500 focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-1/2 px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:border-indigo-500 focus:outline-none"
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:border-indigo-500 focus:outline-none"
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:border-indigo-500 focus:outline-none"
          rows={4}
          required
        ></textarea>

        <button
          type="submit"
          className="w-full bg-indigo-600 py-2 rounded hover:bg-indigo-700 transition text-white font-semibold"
        >
          Send
        </button>

        {status && (
          <p className="mt-4 text-center text-green-400 text-sm">{status}</p>
        )}
      </form>
    </div>
  );
}
