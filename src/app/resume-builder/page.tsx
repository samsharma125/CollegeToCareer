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
    <div className="max-w-3xl mx-auto space-y-5">

      <h1 className="text-3xl font-bold">ATS Resume Builder</h1>

      <input
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
        className="w-full p-3 rounded bg-slate-800"
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full p-3 rounded bg-slate-800"
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        className="w-full p-3 rounded bg-slate-800"
      />

      <input
        name="linkedin"
        placeholder="LinkedIn URL"
        onChange={handleChange}
        className="w-full p-3 rounded bg-slate-800"
      />

      <textarea
        name="skills"
        placeholder="Skills (Python, React, SQL...)"
        onChange={handleChange}
        className="w-full p-3 rounded bg-slate-800"
      />

      <textarea
        name="education"
        placeholder="Education"
        onChange={handleChange}
        className="w-full p-3 rounded bg-slate-800"
      />

      <textarea
        name="experience"
        placeholder="Experience"
        onChange={handleChange}
        className="w-full p-3 rounded bg-slate-800"
      />

      <textarea
        name="projects"
        placeholder="Projects"
        onChange={handleChange}
        className="w-full p-3 rounded bg-slate-800"
      />

      <button
        onClick={downloadPDF}
        className="bg-blue-600 px-6 py-3 rounded font-semibold"
      >
        Download ATS Resume
      </button>

    </div>
  );
}