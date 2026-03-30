"use client";

import { useState } from "react";
import jsPDF from "jspdf";

export default function ResumeBuilder() {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    skills: "",
    education: "",
    experience: "",
    projects: "",
  });

  const handleChange = (e: any) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text(data.name, 20, y);

    y += 10;
    doc.setFontSize(12);
    doc.text(`${data.email} | ${data.phone} | ${data.linkedin}`, 20, y);

    y += 15;
    doc.text("SKILLS", 20, y);
    y += 8;
    doc.text(data.skills, 20, y);

    y += 12;
    doc.text("EDUCATION", 20, y);
    y += 8;
    doc.text(data.education, 20, y);

    y += 12;
    doc.text("EXPERIENCE", 20, y);
    y += 8;
    doc.text(data.experience, 20, y);

    y += 12;
    doc.text("PROJECTS", 20, y);
    y += 8;
    doc.text(data.projects, 20, y);

    doc.save("ATS_Resume.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            ATS Resume Builder
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Build a professional resume in seconds
          </p>
        </div>

        {/* FORM CARD */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-6">

          {/* PERSONAL INFO */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Personal Info</h2>

            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="p-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
              />
              <input
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                className="p-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
              />
            </div>

            <input
              name="linkedin"
              placeholder="LinkedIn URL"
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* SKILLS */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Skills</h2>
            <textarea
              name="skills"
              placeholder="Python, React, SQL..."
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* EDUCATION */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Education</h2>
            <textarea
              name="education"
              placeholder="Your education details..."
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* EXPERIENCE */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Experience</h2>
            <textarea
              name="experience"
              placeholder="Your work experience..."
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* PROJECTS */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Projects</h2>
            <textarea
              name="projects"
              placeholder="Your projects..."
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={downloadPDF}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition shadow-lg font-semibold"
          >
            Download ATS Resume
          </button>

        </div>
      </div>
    </div>
  );
}