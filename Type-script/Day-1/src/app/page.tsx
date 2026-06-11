"use client";

import Link from "next/link";

export default function HomeLanding() {
  return (
    <div className="landing-container">
      {/* Styles for the premium landing page */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        
        body {
          font-family: 'Outfit', sans-serif !important;
          background-color: #030509;
          margin: 0;
          padding: 0;
        }

        .landing-container {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 0%, #0c152a 0%, #030509 80%);
          color: #e2e8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        /* Ambient Glow Blobs */
        .glow-orb {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
          top: -100px;
          filter: blur(50px);
          z-index: 1;
        }

        .glow-orb-purple {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%);
          bottom: -150px;
          right: -100px;
          filter: blur(60px);
          z-index: 1;
        }

        .content-card {
          max-width: 860px;
          width: 100%;
          background: rgba(10, 15, 30, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 24px;
          padding: 60px 40px;
          box-sizing: border-box;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          z-index: 10;
          position: relative;
        }

        .studio-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 24px;
        }

        .title {
          font-size: 3.2rem;
          font-weight: 800;
          margin: 0 0 16px 0;
          letter-spacing: -1.5px;
          line-height: 1.1;
          background: linear-gradient(135deg, #ffffff 30%, #93c5fd 70%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .description {
          font-size: 1.15rem;
          line-height: 1.6;
          color: #94a3b8;
          max-width: 620px;
          margin: 0 auto 40px auto;
          font-weight: 400;
        }

        /* Glowing CTA Button */
        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          text-decoration: none;
          padding: 16px 36px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.3);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(59, 130, 246, 0.5);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .cta-button:active {
          transform: translateY(0);
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 60px;
          text-align: left;
        }

        .feature-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(59, 130, 246, 0.15);
          transform: translateY(-2px);
        }

        .feature-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(139, 92, 246, 0.1);
          color: #a78bfa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .feature-title {
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #f8fafc;
        }

        .feature-desc {
          font-size: 0.82rem;
          line-height: 1.5;
          color: #64748b;
          margin: 0;
        }

        @media (max-width: 768px) {
          .title {
            font-size: 2.2rem;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
          .content-card {
            padding: 40px 20px;
          }
        }
      ` }} />

      <div className="glow-orb" />
      <div className="glow-orb-purple" />

      <div className="content-card">
        <div className="studio-badge">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
          </svg>
          Next Generation AI
        </div>

        <h1 className="title">Antigravity Resume Studio</h1>
        
        <p className="description">
          Build high-scoring, developer-centric resumes instantly with the power of Google Gemini AI. Choose a template, fine-tune with smart completions, and export clean PDFs.
        </p>

        <Link href="/my-personal-resume" className="cta-button">
          Create Your Resume
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>

        {/* Feature Highlights */}
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#60a5fa" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
              </svg>
            </div>
            <h3 className="feature-title">Gemini Copilot</h3>
            <p className="feature-desc">AI-powered summary optimizer and job bullet point generator trained on tech roles.</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon" style={{ background: "rgba(139, 92, 246, 0.1)", color: "#a78bfa" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
              </svg>
            </div>
            <h3 className="feature-title">Live A4 Engine</h3>
            <p className="feature-desc">Side-by-side interactive paper preview. Change templates and see updates instantly.</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#34d399" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="feature-title">Direct PDF Print</h3>
            <p className="feature-desc">Clean, optimized standard layout print sheets ready for recruiters and job portals.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
