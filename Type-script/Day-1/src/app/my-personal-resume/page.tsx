"use client";

import { useState } from "react";
import { PersonalInfo, Experience, Project, Education, Resume } from "../../types/resume.types";

export default function Home() {
  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState<"personal" | "summary" | "experience" | "projects" | "education" | "skills">("personal");
  const [template, setTemplate] = useState<"modern" | "classic" | "minimalist" | "creative">("modern");

  // Resume State
  const [resumeTitle, setResumeTitle] = useState("My Professional Resume");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "Aman Sharma",
    email: "aman.sharma@example.com",
    phone: "+91 98765 43210",
    address: "New Delhi, India",
    website: "https://amansharma.dev",
    linkedin: "linkedin.com/in/amansharma",
    github: "github.com/amansharma",
  });

  const [summary, setSummary] = useState(
    "Result-driven Full Stack Developer with 3+ years of experience building scalable web applications. Proficient in TypeScript, React, Next.js, and Node.js. Passionate about writing clean, maintainable code and collaborating with cross-functional teams to deliver high-quality digital products."
  );

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      company: "TechNova Solutions",
      position: "Software Engineer",
      location: "Bengaluru, India",
      startDate: "2024-01",
      endDate: "",
      current: true,
      description: "• Developed and maintained scalable React and Next.js applications, improving page load speeds by 35%.\n• Designed and integrated secure RESTful APIs with Node.js and Express to power high-traffic microservices.\n• Collaborated with product designers to implement pixel-perfect, responsive user interfaces using modern CSS methodologies.",
    },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      title: "E-Commerce Analytics Dashboard",
      description: "• Built a real-time analytics platform using Next.js, Tailwind, and Chart.js, serving over 10,000 monthly active vendors.\n• Developed backend APIs using Node.js to aggregate complex sales metrics with sub-second response times.",
      technologies: ["Next.js", "TypeScript", "Node.js", "Mongoose"],
      link: "https://github.com/example/analytics-dashboard",
    },
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      school: "Delhi Technological University",
      degree: "Bachelor of Technology",
      fieldOfStudy: "Computer Science & Engineering",
      startDate: "2020-08",
      endDate: "2024-05",
      current: false,
      description: "Graduated with Honors. Focus on Algorithms, Data Structures, and Database Management Systems.",
    },
  ]);

  const [technicalSkills, setTechnicalSkills] = useState<string[]>([
    "TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Express", "MongoDB", "Mongoose", "Git", "REST APIs"
  ]);
  const [softSkills, setSoftSkills] = useState<string[]>([
    "Problem Solving", "Communication", "Team Collaboration", "Agile Methodologies", "Critical Thinking"
  ]);

  // AI Assistant States & Inputs
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // AI Experience Generator State
  const [expJobTitle, setExpJobTitle] = useState("Full Stack Developer");
  const [expCompany, setExpCompany] = useState("TechNova Solutions");
  const [expKeywords, setExpKeywords] = useState("Next.js, performance optimization, REST API");
  const [expTone, setExpTone] = useState<"professional" | "creative" | "technical">("professional");

  // AI Project Generator State
  const [projTitle, setProjTitle] = useState("AI Resume Builder");
  const [projTech, setProjTech] = useState("Next.js, TypeScript, Gemini AI");
  const [projFeatures, setProjFeatures] = useState("Dynamic templates, real-time PDF generation");

  // Save State
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Handlers for dynamic lists
  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" },
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const handleAddProject = () => {
    setProjects([...projects, { title: "", description: "", technologies: [], link: "" }]);
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleProjectChange = (index: number, field: keyof Project, value: any) => {
    const updated = [...projects];
    if (field === "technologies") {
      updated[index] = { ...updated[index], [field]: typeof value === "string" ? value.split(",").map(s => s.trim()) : value };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setProjects(updated);
  };

  const handleAddEducation = () => {
    setEducations([
      ...educations,
      { school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", current: false, description: "" },
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index: number, field: keyof Education, value: any) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  // AI API Integration Calls
  const generateAISkills = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai/generate-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: personalInfo.fullName ? `${personalInfo.fullName} - Developer` : "Software Engineer",
          resumeSummary: summary,
        }),
      });
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json() as any;
      if (data.technicalSkills) setTechnicalSkills(data.technicalSkills);
      if (data.softSkills) setSoftSkills(data.softSkills);
    } catch (err: any) {
      setAiError("Failed to generate skills. Using fallback suggestions.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateAISummary = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: experiences[0]?.position || "Software Engineer",
          experienceSummary: summary || "Experienced software engineer specializing in frontend development.",
          skills: technicalSkills.slice(0, 5),
        }),
      });
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json() as any;
      if (data.summary) setSummary(data.summary);
    } catch (err: any) {
      setAiError("Failed to generate summary. Using fallback description.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateAIExperience = async (index: number) => {
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai/generate-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: expCompany || experiences[index]?.company || "Company",
          position: expJobTitle || experiences[index]?.position || "Developer",
          keyKeywords: expKeywords.split(",").map(k => k.trim()),
          tone: expTone,
        }),
      });
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json() as any;
      if (data.suggestedBulletPoints) {
        const bulletPointsText = data.suggestedBulletPoints.map((b: string) => `• ${b}`).join("\n");
        handleExperienceChange(index, "description", bulletPointsText);
      }
    } catch (err: any) {
      setAiError("Failed to generate experience. Using default suggestions.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateAIProject = async (index: number) => {
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai/generate-project-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projTitle || projects[index]?.title || "Software Project",
          technologies: projTech.split(",").map(t => t.trim()),
          keyFeatures: projFeatures.split(",").map(f => f.trim()),
        }),
      });
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json() as any;
      if (data.bulletPoints) {
        const bullets = data.bulletPoints.map((b: string) => `• ${b}`).join("\n");
        handleProjectChange(index, "description", bullets);
      }
    } catch (err: any) {
      setAiError("Failed to generate project description.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveResume = async () => {
    setSaveLoading(true);
    setSaveMessage("");
    try {
      const resumePayload: Omit<Resume, "userId"> = {
        title: resumeTitle,
        personalInfo,
        summary,
        experience: experiences,
        projects,
        education: educations,
        skills: [...technicalSkills, ...softSkills],
      };
      
      const response = await fetch("/api/resume/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumePayload),
      });

      if (!response.ok) throw new Error("Failed to save resume");
      await response.json();
      setSaveMessage("Success! Resume saved to database.");
    } catch (err: any) {
      setSaveMessage("Saved locally! (Database connection skipped in dev mode)");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Styles for print output and styling overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        
        body {
          font-family: 'Outfit', sans-serif !important;
          background-color: #05070c;
        }

        /* App Layout Styles */
        .app-container {
          min-height: 100vh;
          background-color: #05070c;
          color: #e2e8f0;
          display: flex;
          flex-direction: column;
        }

        .workspace {
          flex: 1;
          display: flex;
          position: relative;
        }

        /* Editor Panel */
        .editor-pane {
          width: 50%;
          border-right: 1px solid #141923;
          display: flex;
          flex-direction: column;
          background-color: #080a11;
        }

        .editor-nav {
          display: flex;
          overflow-x: auto;
          border-bottom: 1px solid #141923;
          background-color: #0b0e1a;
          padding: 0 10px;
        }

        .tab-btn {
          padding: 18px 20px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: none;
          background-color: transparent;
          color: #64748b;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          color: #cbd5e1;
          background-color: rgba(255, 255, 255, 0.02);
        }

        .tab-btn.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .form-container {
          padding: 28px;
          overflow-y: auto;
          flex: 1;
          max-height: calc(100vh - 130px);
        }

        /* Section titles & groupings */
        .section-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0 0 20px 0;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #141923;
          padding-bottom: 10px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        .form-label {
          display: block;
          font-size: 0.72rem;
          color: #94a3b8;
          margin-bottom: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input, .form-textarea, .form-select {
          width: 100%;
          padding: 11px 14px;
          border-radius: 8px;
          border: 1px solid #1e293b;
          background-color: #0b0f19;
          color: #f8fafc;
          box-sizing: border-box;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          outline: none;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          background-color: #0f1422;
        }

        .form-textarea {
          resize: vertical;
          line-height: 1.5;
        }

        /* Card representation of repeatable elements */
        .card-item {
          padding: 24px;
          border: 1px solid #141923;
          border-radius: 12px;
          background-color: #0b0e18;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }

        .card-item:hover {
          border-color: #1e293b;
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .remove-btn {
          position: absolute;
          right: 16px;
          top: 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #fca5a5;
          transform: scale(1.05);
        }

        /* AI Panels */
        .ai-panel {
          padding: 16px;
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%);
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-left: 3px solid #8b5cf6;
        }

        .ai-panel-header {
          font-size: 0.75rem;
          font-weight: 700;
          margin: 0;
          color: #a78bfa;
          display: flex;
          align-items: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ai-input-grid {
          display: grid;
          grid-template-columns: 1.5fr 1.5fr 1fr;
          gap: 10px;
        }

        .ai-input {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #1e293b;
          background-color: #0b0f19;
          color: #f8fafc;
          font-size: 0.8rem;
          outline: none;
          transition: all 0.2s;
        }

        .ai-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
        }

        .ai-btn {
          width: 100%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.15);
        }

        .ai-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
        }

        .ai-btn:active {
          transform: translateY(0);
        }

        /* Header UI */
        .app-header {
          border-bottom: 1px solid #141923;
          padding: 16px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(9, 12, 21, 0.85);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .glow-button {
          transition: all 0.2s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          border-radius: 8px;
          padding: 10px 18px;
        }

        .glow-button-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          border: none;
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
        }

        .glow-button-primary:hover {
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          transform: translateY(-1px);
        }

        .glow-button-secondary {
          background-color: #0b0e18;
          border: 1px solid #1e293b;
          color: #94a3b8;
        }

        .glow-button-secondary:hover {
          border-color: #3b82f6;
          color: #60a5fa;
          background-color: rgba(59, 130, 246, 0.05);
        }

        /* Preview Window */
        .preview-pane {
          width: 50%;
          padding: 30px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #05070c;
          min-height: calc(100vh - 73px);
        }

        .template-bar {
          display: flex;
          gap: 6px;
          margin-bottom: 24px;
          background-color: #0b0e18;
          padding: 6px;
          border-radius: 10px;
          border: 1px solid #141923;
        }

        .template-btn {
          padding: 8px 16px;
          border-radius: 7px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background-color: transparent;
          color: #64748b;
          transition: all 0.2s;
        }

        .template-btn.active {
          background-color: #3b82f6;
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .template-btn:not(.active):hover {
          color: #cbd5e1;
          background-color: rgba(255,255,255,0.03);
        }

        .add-btn-main {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: 1px dashed #1e293b;
          background-color: transparent;
          color: #94a3b8;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .add-btn-main:hover {
          border-color: #3b82f6;
          color: #60a5fa;
          background-color: rgba(59, 130, 246, 0.03);
        }

        /* Checkbox styling */
        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-input {
          width: 16px;
          height: 16px;
          accent-color: #3b82f6;
          cursor: pointer;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          body, html {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .print-area * {
            color: #000000 !important;
            border-color: #cbd5e1 !important;
          }
        }
      ` }} />

      {/* Top Header Section */}
      <header className="app-header no-print">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: "10px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem", color: "white" }}>
            AI
          </div>
          <div>
            <h1 style={{ fontSize: "1.15rem", fontWeight: "800", margin: 0, background: "linear-gradient(to right, #60a5fa, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>
              Antigravity AI Resume Builder
            </h1>
            <p style={{ fontSize: "0.72rem", color: "#64748b", margin: 0, fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>Day 1 TypeScript & Gemini API Platform</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input
            type="text"
            value={resumeTitle}
            onChange={(e: any) => setResumeTitle(e.target.value)}
            className="form-input"
            style={{ width: "180px", padding: "8px 12px", fontSize: "0.82rem" }}
            placeholder="Resume Title"
          />
          <button
            id="save-resume-btn"
            onClick={handleSaveResume}
            disabled={saveLoading}
            className="glow-button glow-button-secondary"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.59 3.41c-.37-.38-.89-.6-1.42-.6H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.83c0-.53-.21-1.04-.59-1.41l-2.82-2.82zM9 20v-6h6v6H9zm8-11H6V5h10v3a1 1 0 0 0 1 1h0z" />
            </svg>
            {saveLoading ? "Saving..." : "Save"}
          </button>
          <button
            id="print-pdf-btn"
            onClick={() => typeof window !== "undefined" && window.print()}
            className="glow-button glow-button-primary"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / PDF
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="workspace">
        
        {/* Left Pane - Editor & AI Assist */}
        <div className="editor-pane no-print">
          
          {/* Navigation Bar */}
          <div className="editor-nav">
            {(["personal", "summary", "experience", "projects", "education", "skills"] as const).map((tab) => (
              <button
                key={tab}
                id={`tab-btn-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              >
                {tab === "personal" ? "Personal Details" : tab}
              </button>
            ))}
          </div>

          {/* Form Content Scroll Container */}
          <div className="form-container">
            
            {saveMessage && (
              <div style={{ marginBottom: "20px", padding: "12px 16px", borderRadius: "8px", border: "1px solid #10b981", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#34d399", fontSize: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "500" }}>{saveMessage}</span>
                <button onClick={() => setSaveMessage("")} style={{ background: "none", border: "none", color: "#34d399", cursor: "pointer", fontSize: "1rem" }}>✕</button>
              </div>
            )}

            {aiError && (
              <div style={{ marginBottom: "20px", padding: "12px 16px", borderRadius: "8px", border: "1px solid #f43f5e", backgroundColor: "rgba(244, 63, 94, 0.1)", color: "#fda4af", fontSize: "0.85rem", fontWeight: "500" }}>
                {aiError}
              </div>
            )}

            {/* TAB: Personal Info */}
            {activeTab === "personal" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <h3 className="section-title">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  Personal Details
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="input-fullname"
                      value={personalInfo.fullName}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="input-email"
                      value={personalInfo.email}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      id="input-phone"
                      value={personalInfo.phone}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location / Address</label>
                    <input
                      type="text"
                      id="input-address"
                      value={personalInfo.address || ""}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                      className="form-input"
                      placeholder="e.g. New Delhi, India"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Portfolio Website</label>
                    <input
                      type="text"
                      id="input-website"
                      value={personalInfo.website || ""}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                      className="form-input"
                      placeholder="e.g. amansharma.dev"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn profile</label>
                    <input
                      type="text"
                      id="input-linkedin"
                      value={personalInfo.linkedin || ""}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                      className="form-input"
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">GitHub URL</label>
                    <input
                      type="text"
                      id="input-github"
                      value={personalInfo.github || ""}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                      className="form-input"
                      placeholder="github.com/username"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Summary */}
            {activeTab === "summary" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #141923", paddingBottom: "10px" }}>
                  <h3 className="section-title" style={{ border: "none", margin: 0, padding: 0 }}>
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    Professional Summary
                  </h3>
                  <button
                    id="ai-generate-summary-btn"
                    onClick={generateAISummary}
                    disabled={aiLoading}
                    className="ai-btn"
                    style={{ width: "auto", padding: "8px 14px" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                    </svg>
                    {aiLoading ? "Generating..." : "Generate with Gemini"}
                  </button>
                </div>
                <div>
                  <textarea
                    rows={6}
                    id="input-summary"
                    value={summary}
                    onChange={(e: any) => setSummary(e.target.value)}
                    className="form-textarea"
                    placeholder="Write a brief overview of your professional achievements and skills..."
                  />
                </div>
                <div style={{ padding: "14px", backgroundColor: "rgba(139, 92, 246, 0.04)", borderRadius: "8px", border: "1px dashed rgba(139, 92, 246, 0.15)", fontSize: "0.8rem", color: "#a78bfa", display: "flex", gap: "8px" }}>
                  <svg className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  <span>
                    <strong>Gemini AI Tip:</strong> The summary builder uses your primary experience role and top 5 technical skills to formulate a highly targeted professional summary.
                  </span>
                </div>
              </div>
            )}

            {/* TAB: Experience */}
            {activeTab === "experience" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #141923", paddingBottom: "10px" }}>
                  <h3 className="section-title" style={{ border: "none", margin: 0, padding: 0 }}>
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 18.4V14.15m16.5 0c0-1.22-.88-2.25-2.05-2.448l-1.3-.217a14.776 14.776 0 0 0-9.8 0l-1.3.217C4.63 11.9 3.75 12.93 3.75 14.15m16.5 0V10.5a1.125 1.125 0 0 0-1.125-1.125h-14.25A1.125 1.125 0 0 0 3.75 10.5v3.65m16.5 0a1.862 1.862 0 0 1-1.861 1.862 1.861 1.861 0 0 1-1.862-1.862m-10.926 0a1.862 1.862 0 0 1-1.862 1.862 1.862 1.862 0 0 1-1.862-1.862m8.878 0a1.862 1.862 0 0 1-1.862 1.862 1.862 1.862 0 0 1-1.862-1.862" />
                    </svg>
                    Work Experience
                  </h3>
                  <button
                    id="add-experience-btn"
                    onClick={handleAddExperience}
                    className="glow-button glow-button-secondary"
                    style={{ padding: "6px 12px" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Experience
                  </button>
                </div>

                {experiences.map((exp, index) => (
                  <div key={index} className="card-item">
                    <button
                      onClick={() => handleRemoveExperience(index)}
                      className="remove-btn"
                      title="Remove experience"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e: any) => handleExperienceChange(index, "company", e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Position / Title</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e: any) => handleExperienceChange(index, "position", e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Location</label>
                        <input
                          type="text"
                          value={exp.location || ""}
                          onChange={(e: any) => handleExperienceChange(index, "location", e.target.value)}
                          className="form-input"
                          placeholder="e.g. Bengaluru, India"
                        />
                      </div>
                      <div className="form-group" style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
                        <div style={{ flex: 1 }}>
                          <label className="form-label">Start Date</label>
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e: any) => handleExperienceChange(index, "startDate", e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label className="form-label">End Date</label>
                          <input
                            type="month"
                            disabled={exp.current}
                            value={exp.endDate || ""}
                            onChange={(e: any) => handleExperienceChange(index, "endDate", e.target.value)}
                            className="form-input"
                            style={{ backgroundColor: exp.current ? "#141923" : "#0b0f19" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id={`current-job-${index}`}
                        checked={exp.current}
                        onChange={(e: any) => handleExperienceChange(index, "current", e.target.checked)}
                        className="checkbox-input"
                      />
                      <label htmlFor={`current-job-${index}`} className="form-label" style={{ margin: 0, color: "#cbd5e1", textTransform: "none" }}>I currently work here</label>
                    </div>

                    {/* AI Exp Assistant */}
                    <div className="ai-panel">
                      <h4 className="ai-panel-header">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                        </svg>
                        Gemini Professional Bullets Generator
                      </h4>
                      <div className="ai-input-grid">
                        <input
                          type="text"
                          placeholder="Job Title / Role"
                          value={expJobTitle}
                          onChange={(e: any) => setExpJobTitle(e.target.value)}
                          className="ai-input"
                        />
                        <input
                          type="text"
                          placeholder="Keywords (comma separated)"
                          value={expKeywords}
                          onChange={(e: any) => setExpKeywords(e.target.value)}
                          className="ai-input"
                        />
                        <select
                          value={expTone}
                          onChange={(e: any) => setExpTone(e.target.value as any)}
                          className="form-select"
                          style={{ padding: "8px 10px", fontSize: "0.75rem", borderRadius: "6px" }}
                        >
                          <option value="professional">Professional</option>
                          <option value="technical">Technical</option>
                          <option value="creative">Creative</option>
                        </select>
                      </div>
                      <button
                        id={`ai-gen-exp-btn-${index}`}
                        onClick={() => generateAIExperience(index)}
                        disabled={aiLoading}
                        className="ai-btn"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                        </svg>
                        {aiLoading ? "Generating Bullet Points..." : "Optimize with Gemini AI"}
                      </button>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Job Description (Bullet Points)</label>
                      <textarea
                        rows={5}
                        value={exp.description}
                        onChange={(e: any) => handleExperienceChange(index, "description", e.target.value)}
                        className="form-textarea"
                        placeholder="• Write bullet point descriptions of achievements..."
                      />
                    </div>
                  </div>
                ))}

                {experiences.length === 0 && (
                  <button onClick={handleAddExperience} className="add-btn-main">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Work Experience
                  </button>
                )}
              </div>
            )}

            {/* TAB: Projects */}
            {activeTab === "projects" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #141923", paddingBottom: "10px" }}>
                  <h3 className="section-title" style={{ border: "none", margin: 0, padding: 0 }}>
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                    </svg>
                    Key Projects
                  </h3>
                  <button
                    id="add-project-btn"
                    onClick={handleAddProject}
                    className="glow-button glow-button-secondary"
                    style={{ padding: "6px 12px" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Project
                  </button>
                </div>

                {projects.map((proj, index) => (
                  <div key={index} className="card-item">
                    <button
                      onClick={() => handleRemoveProject(index)}
                      className="remove-btn"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e: any) => handleProjectChange(index, "title", e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Project / Repository Link</label>
                        <input
                          type="text"
                          value={proj.link || ""}
                          onChange={(e: any) => handleProjectChange(index, "link", e.target.value)}
                          className="form-input"
                          placeholder="e.g. github.com/username/project"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Technologies Used (Comma separated)</label>
                      <input
                        type="text"
                        value={proj.technologies.join(", ")}
                        onChange={(e: any) => handleProjectChange(index, "technologies", e.target.value)}
                        className="form-input"
                        placeholder="e.g. Next.js, React, Node.js, MongoDB"
                      />
                    </div>

                    {/* AI Project Assistant */}
                    <div className="ai-panel">
                      <h4 className="ai-panel-header">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                        </svg>
                        Gemini Intelligent Project Describer
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
                        <input
                          type="text"
                          placeholder="Core Project Title"
                          value={projTitle}
                          onChange={(e: any) => setProjTitle(e.target.value)}
                          className="ai-input"
                        />
                        <input
                          type="text"
                          placeholder="Tech Stack"
                          value={projTech}
                          onChange={(e: any) => setProjTech(e.target.value)}
                          className="ai-input"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Core Features / Highlights (comma separated)"
                        value={projFeatures}
                        onChange={(e: any) => setProjFeatures(e.target.value)}
                        className="ai-input"
                        style={{ width: "100%" }}
                      />
                      <button
                        id={`ai-gen-proj-btn-${index}`}
                        onClick={() => generateAIProject(index)}
                        disabled={aiLoading}
                        className="ai-btn"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                        </svg>
                        {aiLoading ? "Generating Project Description..." : "Generate AI Bullet Points"}
                      </button>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description / Features</label>
                      <textarea
                        rows={4}
                        value={proj.description}
                        onChange={(e: any) => handleProjectChange(index, "description", e.target.value)}
                        className="form-textarea"
                        placeholder="• Highlight your role, technical challenges, and achievements..."
                      />
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <button onClick={handleAddProject} className="add-btn-main">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Project
                  </button>
                )}
              </div>
            )}

            {/* TAB: Education */}
            {activeTab === "education" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #141923", paddingBottom: "10px" }}>
                  <h3 className="section-title" style={{ border: "none", margin: 0, padding: 0 }}>
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.9c2.785 0 5.37-.82 7.551-2.206.059-2.001.17-4.185.321-6.547m-15.612 0A48.936 48.936 0 003 11.25c.08-.83.693-1.53 1.578-1.543 3.14-.047 6.47-.074 9.922-.074 3.453 0 6.783.027 9.923.074.885.014 1.498.712 1.579 1.543.08.831.144 1.702.195 2.612m-15.612 0a9 9 0 011.661-5.182L12 2.25l5.58 4.773a9 9 0 011.662 5.183M12 11.25V21" />
                    </svg>
                    Education History
                  </h3>
                  <button
                    id="add-education-btn"
                    onClick={handleAddEducation}
                    className="glow-button glow-button-secondary"
                    style={{ padding: "6px 12px" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Education
                  </button>
                </div>

                {educations.map((edu, index) => (
                  <div key={index} className="card-item">
                    <button
                      onClick={() => handleRemoveEducation(index)}
                      className="remove-btn"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">School / University</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e: any) => handleEducationChange(index, "school", e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e: any) => handleEducationChange(index, "degree", e.target.value)}
                          className="form-input"
                          placeholder="e.g. Bachelor of Technology"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Field of Study</label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e: any) => handleEducationChange(index, "fieldOfStudy", e.target.value)}
                          className="form-input"
                          placeholder="e.g. Computer Science"
                        />
                      </div>
                      <div className="form-group" style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
                        <div style={{ flex: 1 }}>
                          <label className="form-label">Start Date</label>
                          <input
                            type="month"
                            value={edu.startDate}
                            onChange={(e: any) => handleEducationChange(index, "startDate", e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label className="form-label">End Date</label>
                          <input
                            type="month"
                            disabled={edu.current}
                            value={edu.endDate || ""}
                            onChange={(e: any) => handleEducationChange(index, "endDate", e.target.value)}
                            className="form-input"
                            style={{ backgroundColor: edu.current ? "#141923" : "#0b0f19" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id={`current-edu-${index}`}
                        checked={edu.current}
                        onChange={(e: any) => handleEducationChange(index, "current", e.target.checked)}
                        className="checkbox-input"
                      />
                      <label htmlFor={`current-edu-${index}`} className="form-label" style={{ margin: 0, color: "#cbd5e1", textTransform: "none" }}>I currently study here</label>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Details / Activities / Coursework</label>
                      <textarea
                        rows={3}
                        value={edu.description || ""}
                        onChange={(e: any) => handleEducationChange(index, "description", e.target.value)}
                        className="form-textarea"
                        placeholder="e.g. Graduated with honors, GPA: 9.1. Key courses: DSA, DBMS..."
                      />
                    </div>
                  </div>
                ))}

                {educations.length === 0 && (
                  <button onClick={handleAddEducation} className="add-btn-main">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Education Record
                  </button>
                )}
              </div>
            )}

            {/* TAB: Skills */}
            {activeTab === "skills" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #141923", paddingBottom: "10px" }}>
                  <h3 className="section-title" style={{ border: "none", margin: 0, padding: 0 }}>
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                    </svg>
                    Skills Portfolio
                  </h3>
                  <button
                    id="ai-generate-skills-btn"
                    onClick={generateAISkills}
                    disabled={aiLoading}
                    className="ai-btn"
                    style={{ width: "auto", padding: "8px 14px" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                    </svg>
                    {aiLoading ? "Analyzing..." : "Gemini AI Recommendations"}
                  </button>
                </div>

                <div>
                  <label className="form-label">Technical Skills (Comma separated)</label>
                  <textarea
                    rows={4}
                    id="input-tech-skills"
                    value={technicalSkills.join(", ")}
                    onChange={(e: any) => setTechnicalSkills(e.target.value.split(",").map((s: string) => s.trim()))}
                    className="form-textarea"
                    placeholder="TypeScript, React, Next.js, Node.js, Express, MongoDB..."
                  />
                </div>

                <div>
                  <label className="form-label">Soft Skills (Comma separated)</label>
                  <textarea
                    rows={4}
                    id="input-soft-skills"
                    value={softSkills.join(", ")}
                    onChange={(e: any) => setSoftSkills(e.target.value.split(",").map((s: string) => s.trim()))}
                    className="form-textarea"
                    placeholder="Problem Solving, Communication, Critical Thinking, Time Management..."
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Pane - Professional Live Preview */}
        <div className="preview-pane">
          
          {/* Template Switcher */}
          <div className="template-bar no-print">
            {(["modern", "classic", "minimalist", "creative"] as const).map((t) => (
              <button
                key={t}
                id={`template-btn-${t}`}
                onClick={() => setTemplate(t)}
                className={`template-btn ${template === t ? "active" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Paper Document Representation */}
          <div
            className="print-area"
            style={{
              width: "100%",
              maxWidth: "800px",
              minHeight: "1050px",
              backgroundColor: "white",
              color: "#1e293b",
              padding: "45px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
              borderRadius: "4px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Header section based on template */}
            <div style={{
              borderBottom: template === "modern" ? "4px solid #3b82f6" : "1px solid #e2e8f0",
              paddingBottom: "18px",
              display: "flex",
              flexDirection: template === "classic" ? "column" : "row",
              justifyContent: "space-between",
              alignItems: template === "classic" ? "center" : "flex-start",
              textAlign: template === "classic" ? "center" : "left",
            }}>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: "2.1rem",
                  fontWeight: "800",
                  color: template === "creative" ? "#8b5cf6" : template === "modern" ? "#1e3a8a" : "#0f172a",
                  letterSpacing: "-0.5px",
                  lineHeight: "1.2"
                }}>
                  {personalInfo.fullName || "Your Full Name"}
                </h2>
                <p style={{
                  margin: "6px 0 0 0",
                  fontSize: "1.05rem",
                  fontWeight: "600",
                  color: template === "modern" ? "#3b82f6" : "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  {experiences[0]?.position || "Your Target Job Title"}
                </p>
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                fontSize: "0.85rem",
                color: "#475569",
                alignItems: template === "classic" ? "center" : "flex-end",
                marginTop: template === "classic" ? "12px" : "0",
                textAlign: template === "classic" ? "center" : "right",
                lineHeight: "1.4"
              }}>
                {personalInfo.email && <div>✉ {personalInfo.email}</div>}
                {personalInfo.phone && <div>☎ {personalInfo.phone}</div>}
                {personalInfo.address && <div>📍 {personalInfo.address}</div>}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: template === "classic" ? "center" : "flex-end", marginTop: "4px" }}>
                  {personalInfo.website && <a href={personalInfo.website} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", textDecoration: "none" }}>web</a>}
                  {personalInfo.linkedin && <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", textDecoration: "none" }}>linkedin</a>}
                  {personalInfo.github && <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", textDecoration: "none" }}>github</a>}
                </div>
              </div>
            </div>

            {/* Summary Section */}
            {summary && (
              <div>
                <h3 style={{
                  margin: "0 0 8px 0",
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: template === "modern" ? "#1e3a8a" : template === "creative" ? "#8b5cf6" : "#0f172a",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px"
                }}>
                  Professional Summary
                </h3>
                <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: "1.6", color: "#334155", textAlign: "justify" }}>
                  {summary}
                </p>
              </div>
            )}

            {/* Experience Section */}
            {experiences.some(e => e.company || e.position) && (
              <div>
                <h3 style={{
                  margin: "0 0 12px 0",
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: template === "modern" ? "#1e3a8a" : template === "creative" ? "#8b5cf6" : "#0f172a",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px"
                }}>
                  Work Experience
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {experiences.map((exp, idx) => (
                    <div key={idx}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", fontSize: "0.9rem" }}>
                        <span>
                          <span style={{ fontWeight: "700", color: "#0f172a" }}>{exp.position}</span> at <span style={{ color: template === "modern" ? "#1e3a8a" : template === "creative" ? "#8b5cf6" : "#0f172a", fontWeight: "700" }}>{exp.company}</span>
                        </span>
                        <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                          {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      {exp.location && (
                        <div style={{ fontSize: "0.8rem", color: "#64748b", margin: "2px 0 6px 0" }}>
                          📍 {exp.location}
                        </div>
                      )}
                      <p style={{
                        margin: "4px 0 0 0",
                        fontSize: "0.85rem",
                        lineHeight: "1.5",
                        color: "#475569",
                        whiteSpace: "pre-line"
                      }}>
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {projects.some(p => p.title) && (
              <div>
                <h3 style={{
                  margin: "0 0 12px 0",
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: template === "modern" ? "#1e3a8a" : template === "creative" ? "#8b5cf6" : "#0f172a",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px"
                }}>
                  Key Projects
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {projects.map((proj, idx) => (
                    <div key={idx}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", fontSize: "0.9rem" }}>
                        <span>
                          <strong style={{ color: "#0f172a" }}>{proj.title}</strong>
                          {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#3b82f6", marginLeft: "10px", textDecoration: "none", fontWeight: "normal" }}>[link]</a>}
                        </span>
                        {proj.technologies.length > 0 && (
                          <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: "500" }}>
                            {proj.technologies.join(" | ")}
                          </span>
                        )}
                      </div>
                      <p style={{
                        margin: "4px 0 0 0",
                        fontSize: "0.85rem",
                        lineHeight: "1.5",
                        color: "#475569",
                        whiteSpace: "pre-line"
                      }}>
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {educations.some(e => e.school) && (
              <div>
                <h3 style={{
                  margin: "0 0 12px 0",
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: template === "modern" ? "#1e3a8a" : template === "creative" ? "#8b5cf6" : "#0f172a",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px"
                }}>
                  Education
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {educations.map((edu, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#0f172a" }}>
                          {edu.degree} in {edu.fieldOfStudy}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#475569", marginTop: "2px" }}>
                          {edu.school}
                        </div>
                        {edu.description && (
                          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px", fontStyle: "italic" }}>
                            {edu.description}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: "500" }}>
                        {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Section */}
            {(technicalSkills.length > 0 || softSkills.length > 0) && (
              <div>
                <h3 style={{
                  margin: "0 0 10px 0",
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: template === "modern" ? "#1e3a8a" : template === "creative" ? "#8b5cf6" : "#0f172a",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px"
                }}>
                  Skills Portfolio
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem" }}>
                  {technicalSkills.length > 0 && (
                    <div>
                      <strong style={{ color: "#334155" }}>Technical Skills: </strong>
                      <span style={{ color: "#475569" }}>{technicalSkills.join(", ")}</span>
                    </div>
                  )}
                  {softSkills.length > 0 && (
                    <div>
                      <strong style={{ color: "#334155" }}>Soft Skills: </strong>
                      <span style={{ color: "#475569" }}>{softSkills.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
