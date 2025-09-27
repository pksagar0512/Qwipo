import React, { useState } from "react";

export default function Career() {
  // Example job openings (later you can fetch from backend)
  const [jobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      description: "Work on our React-based platform, building interactive UI components.",
      applyLink: "mailto:careers@qwipo.com?subject=Application for Frontend Developer",
    },
    {
      id: 2,
      title: "Backend Developer",
      description: "Work on our Node.js/Express backend, API integrations, and database design.",
      applyLink: "mailto:careers@qwipo.com?subject=Application for Backend Developer",
    },
    {
      id: 3,
      title: "Digital Marketing Executive",
      description: "Manage campaigns, social media, SEO, and analytics to grow Qwipo’s presence.",
      applyLink: "mailto:careers@qwipo.com?subject=Application for Digital Marketing Executive",
    },
  ]);

  return (
    <div className="pt-24 bg-gray-900 min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        <h1 className="text-4xl font-bold text-indigo-400 text-center">
          Careers at Qwipo
        </h1>
        <p className="text-gray-300 text-lg text-center mb-8">
          Join our team and help drive growth in India’s e-commerce market. Explore our open positions below and apply to be part of our journey.
        </p>

        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition"
            >
              <h2 className="text-2xl font-semibold text-indigo-400 mb-2">
                {job.title}
              </h2>
              <p className="text-gray-300 mb-4">{job.description}</p>
              <a
                href={job.applyLink}
                className="inline-block bg-emerald-500 px-4 py-2 rounded hover:bg-emerald-600 transition font-semibold"
              >
                Apply
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
