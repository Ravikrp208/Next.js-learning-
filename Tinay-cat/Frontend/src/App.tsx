import React, { useState, useEffect, useRef } from "react";
import {
  PawPrint,
  Search,
  Heart,
  Sparkles,
  MessageSquare,
  LogIn,
  LogOut,
  Sun,
  Moon,
  X,
  ChevronRight,
  Baby,
  Home,
  Clock,
  Palette,
  Zap,
  User,
} from "lucide-react";
import "./App.css";

const API_BASE = "http://localhost:3000/api";

interface Cat {
  _id: string;
  name: string;
  breed: string;
  description: string;
  lifespan: number;
  energyLevel: string;
  kidsFriendly: boolean;
  apartmentFriendly: boolean;
  image?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  favoriteCats: string[];
}

interface Message {
  sender: "user" | "assistant";
  text: string;
}

export default function App() {
  // Theme & Auth State
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: "login" | "signup"; message?: string }>({
    isOpen: false,
    type: "login",
  });
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Navigation state
  const [activeTab, setActiveTab] = useState<"all-cats" | "advisor" | "ai-chat" | "favorites">("all-cats");

  // Core Data State
  const [cats, setCats] = useState<Cat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [loadingCats, setLoadingCats] = useState(false);

  // Advisor State
  const [advisorFilters, setAdvisorFilters] = useState({ kidsFriendly: false, apartmentFriendly: false });
  const [advisorDbResults, setAdvisorDbResults] = useState<Cat[]>([]);
  const [advisorAiResult, setAdvisorAiResult] = useState<string>("");
  const [loadingAdvisor, setLoadingAdvisor] = useState(false);
  const [advisorError, setAdvisorError] = useState("");

  // Chat State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Hello! 🐾 I am your Tiny Cat Breed Advisor. Ask me anything about choosing, caring for, or understanding cat breeds!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize Theme and Profile
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }

    if (token) {
      fetchProfile(token);
    }
  }, [token]);

  // Fetch all cats on start
  useEffect(() => {
    fetchCats();
  }, []);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const fetchProfile = async (jwtToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      const data = await response.json();
      if (data.success) {
        setUser({
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          favoriteCats: data.user.favoriteCats.map((c: any) => typeof c === "string" ? c : c._id),
        });
      } else {
        // Token expired or invalid
        handleLogout();
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const fetchCats = async () => {
    setLoadingCats(true);
    try {
      const response = await fetch(`${API_BASE}/cats`);
      const data = await response.json();
      if (data.success) {
        setCats(data.data);
      }
    } catch (err) {
      console.error("Error fetching cats", err);
    } finally {
      setLoadingCats(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      fetchCats();
      return;
    }
    setLoadingCats(true);
    try {
      const response = await fetch(`${API_BASE}/cats/search/all?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.success) {
        setCats(data.data);
      }
    } catch (err) {
      console.error("Error searching cats", err);
    } finally {
      setLoadingCats(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    const endpoint = authModal.type === "login" ? "/auth/login" : "/auth/signup";
    const payload =
      authModal.type === "login"
        ? { email: authForm.email, password: authForm.password }
        : { name: authForm.name, email: authForm.email, password: authForm.password };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          favoriteCats: data.user.favoriteCats || [],
        });
        setAuthSuccess("Successfully logged in!");
        setTimeout(() => {
          setAuthModal({ isOpen: false, type: "login" });
          setAuthForm({ name: "", email: "", password: "" });
          setAuthSuccess("");
        }, 1000);
      } else {
        setAuthError(data.message || "Authentication failed");
      }
    } catch (err) {
      setAuthError("Failed to connect to the server.");
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    setActiveTab("all-cats");
  };

  const toggleFavorite = async (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      setAuthModal({
        isOpen: true,
        type: "login",
        message: "Please log in to add cats to your favorites list!",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ catId }),
      });
      const data = await response.json();
      if (data.success) {
        setUser((prev) => {
          if (!prev) return null;
          const isFavorited = prev.favoriteCats.includes(catId);
          const nextFavorites = isFavorited
            ? prev.favoriteCats.filter((id) => id !== catId)
            : [...prev.favoriteCats, catId];
          return { ...prev, favoriteCats: nextFavorites };
        });
      }
    } catch (err) {
      console.error("Error toggling favorite", err);
    }
  };

  const handleAdvisorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAdvisor(true);
    setAdvisorError("");
    setAdvisorDbResults([]);
    setAdvisorAiResult("");

    try {
      // 1. Fetch from local database matches
      const dbResponse = await fetch(`${API_BASE}/cats/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(advisorFilters),
      });
      const dbData = await dbResponse.json();
      if (dbData.success) {
        setAdvisorDbResults(dbData.data);
      }

      // 2. Fetch AI Advice
      const aiResponse = await fetch(`${API_BASE}/aiRecommend/recommendByAi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(advisorFilters),
      });
      const aiData = await aiResponse.json();
      if (aiData.success) {
        setAdvisorAiResult(aiData.data);
      } else {
        setAdvisorError("Failed to fetch custom AI suggestions.");
      }
    } catch (err) {
      setAdvisorError("Failed to fetch recommendation reports. Please verify backend.");
    } finally {
      setLoadingAdvisor(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || sendingChat) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setSendingChat(true);

    try {
      const response = await fetch(`${API_BASE}/ai/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }),
      });
      const data = await response.json();
      if (data.success) {
        setChatMessages((prev) => [...prev, { sender: "assistant", text: data.data }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: "assistant", text: "Oops, I encountered an error while formulating my thoughts. Please try again!" },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "I couldn't reach the server. Please verify if the backend is running." },
      ]);
    } finally {
      setSendingChat(false);
    }
  };

  const parseMarkdownToHtml = (markdownText: string) => {
    if (!markdownText) return null;
    
    // Quick simple markdown parser to keep it light without external packages
    const lines = markdownText.split("\n");
    return lines.map((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith("# ")) {
        return <h2 key={index} style={{ fontSize: "20px", marginTop: "16px", marginBottom: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "4px" }}>{trimmed.slice(2)}</h2>;
      }
      if (trimmed.startsWith("## ")) {
        return <h3 key={index} style={{ fontSize: "16px", marginTop: "14px", marginBottom: "6px" }}>{trimmed.slice(3)}</h3>;
      }
      if (trimmed.startsWith("### ")) {
        return <h4 key={index} style={{ fontSize: "14px", marginTop: "12px", marginBottom: "4px" }}>{trimmed.slice(4)}</h4>;
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return <li key={index} style={{ marginLeft: "20px", marginBottom: "4px", listStyleType: "disc" }}>{trimmed.slice(2)}</li>;
      }
      if (trimmed.startsWith("---")) {
        return <hr key={index} style={{ border: "0", borderTop: "1px solid var(--border)", margin: "16px 0" }} />;
      }
      if (trimmed === "") {
        return <div key={index} style={{ height: "8px" }} />;
      }
      
      // Inline bold simple replacement
      let innerHtml = trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={index} style={{ marginBottom: "6px", fontSize: "14px" }} dangerouslySetInnerHTML={{ __html: innerHtml }} />;
    });
  };

  const favoritedCats = cats.filter((cat) => user?.favoriteCats.includes(cat._id));

  return (
    <>
      {/* Navigation Header */}
      <header className="navbar">
        <div className="container nav-container">
          <a href="#" className="logo-link" onClick={() => setActiveTab("all-cats")}>
            <PawPrint className="logo-icon" size={28} />
            <span>TinayCat</span>
          </a>

          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <div className="user-menu" onClick={handleLogout} title="Click to Logout">
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user.name}</span>
                <LogOut size={16} style={{ marginLeft: "4px", opacity: 0.6 }} />
              </div>
            ) : (
              <button
                className="nav-btn btn-primary"
                onClick={() => setAuthModal({ isOpen: true, type: "login" })}
              >
                <LogIn size={16} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body content */}
      <main className="container flex-grow">
        {/* Hero Banner */}
        <section className="hero">
          <div className="hero-bg-glow"></div>
          <p className="hero-subtitle">Tiny Cat breed advisory portal</p>
          <h1 className="hero-title">
            Find the Perfect <span>Tiny Feline</span> Companion
          </h1>
          <p className="hero-desc">
            Explore pocket-sized breeds, use our intelligent matching advisory tool, or converse directly with our AI Feline Consultant.
          </p>

          {/* Tab Selection */}
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === "all-cats" ? "active" : ""}`}
              onClick={() => setActiveTab("all-cats")}
            >
              <Home size={18} />
              <span>Catalog</span>
            </button>

            <button
              className={`tab-btn ${activeTab === "advisor" ? "active" : ""}`}
              onClick={() => setActiveTab("advisor")}
            >
              <Sparkles size={18} />
              <span>Breed Advisor</span>
            </button>

            <button
              className={`tab-btn ${activeTab === "ai-chat" ? "active" : ""}`}
              onClick={() => setActiveTab("ai-chat")}
            >
              <MessageSquare size={18} />
              <span>AI Consultant</span>
            </button>

            {user && (
              <button
                className={`tab-btn ${activeTab === "favorites" ? "active" : ""}`}
                onClick={() => setActiveTab("favorites")}
              >
                <Heart size={18} />
                <span>My Favorites ({user.favoriteCats.length})</span>
              </button>
            )}
          </div>
        </section>

        {/* Tab Contents: 1. All Cats */}
        {activeTab === "all-cats" && (
          <section>
            <div className="search-container">
              <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search cats by name or breed..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {loadingCats ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div className="loading-dots" style={{ justifyContent: "center" }}>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <p style={{ marginTop: "12px", color: "var(--text-light)" }}>Fetching feline files...</p>
              </div>
            ) : cats.length === 0 ? (
              <div className="empty-state">
                <PawPrint className="empty-icon" size={48} />
                <h3>No Cats Found</h3>
                <p>We couldn't find any cute cats matching "{searchQuery}". Try searching for something else!</p>
              </div>
            ) : (
              <div className="cat-grid">
                {cats.map((cat) => {
                  const isFavorited = user?.favoriteCats.includes(cat._id) || false;
                  return (
                    <div key={cat._id} className="cat-card" onClick={() => setSelectedCat(cat)}>
                      <div className="cat-image-wrapper">
                        <img
                          src={cat.image || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600"}
                          alt={cat.name}
                          className="cat-image"
                        />
                        <button
                          className={`favorite-btn ${isFavorited ? "active" : ""}`}
                          onClick={(e) => toggleFavorite(cat._id, e)}
                          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <div className="cat-details">
                        <span className="cat-breed-tag">{cat.breed}</span>
                        <h2 className="cat-name">{cat.name}</h2>
                        <p className="cat-desc">{cat.description}</p>
                        
                        <div className="cat-tags">
                          {cat.kidsFriendly && <span className="tag tag-kids">Kids Friendly</span>}
                          {cat.apartmentFriendly && <span className="tag tag-apartment">Apartment Friendly</span>}
                        </div>

                        <div className="cat-card-footer">
                          <span className="cat-info-item">
                            <Clock size={14} />
                            {cat.lifespan} years
                          </span>
                          <button className="btn-card-details">
                            <span>Details</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Tab Contents: 2. Breed Advisor */}
        {activeTab === "advisor" && (
          <section className="advisor-layout">
            <div className="advisor-form-card">
              <h2 className="form-title">Matching Form</h2>
              <p className="form-desc">Select features to search our database and generate detailed AI advice matching your lifestyle.</p>

              <form onSubmit={handleAdvisorSubmit}>
                <div className="form-section">
                  <span className="form-label-header">Household Dynamics</span>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        className="checkbox-input"
                        checked={advisorFilters.kidsFriendly}
                        onChange={(e) => setAdvisorFilters({ ...advisorFilters, kidsFriendly: e.target.checked })}
                      />
                      <div className="checkbox-info">
                        <span className="checkbox-title">Kids Friendly</span>
                        <span className="checkbox-desc">Cats known to be gentle and playful around children.</span>
                      </div>
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        className="checkbox-input"
                        checked={advisorFilters.apartmentFriendly}
                        onChange={(e) =>
                          setAdvisorFilters({ ...advisorFilters, apartmentFriendly: e.target.checked })
                        }
                      />
                      <div className="checkbox-info">
                        <span className="checkbox-title">Apartment Friendly</span>
                        <span className="checkbox-desc">Adaptable to small living spaces without intense roaming needs.</span>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary btn-submit-advisor"
                  disabled={loadingAdvisor}
                >
                  <Sparkles size={16} />
                  <span>{loadingAdvisor ? "Analyzing..." : "Find Matches"}</span>
                </button>
              </form>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              {loadingAdvisor && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div className="loading-dots" style={{ justifyContent: "center" }}>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                  <p style={{ marginTop: "12px", color: "var(--text-light)" }}>Consulting Gemini AI and Searching Databases...</p>
                </div>
              )}

              {advisorError && (
                <div className="alert-message alert-error">
                  {advisorError}
                </div>
              )}

              {!loadingAdvisor && !advisorDbResults.length && !advisorAiResult && (
                <div className="empty-state" style={{ margin: "0 auto" }}>
                  <Sparkles className="empty-icon" size={48} />
                  <h3>No Selection Yet</h3>
                  <p>Choose criteria on the left and submit to view database results and custom AI advice sheets.</p>
                </div>
              )}

              {/* Database Results */}
              {!loadingAdvisor && advisorDbResults.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>Database Matches ({advisorDbResults.length})</h3>
                  <div className="cat-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
                    {advisorDbResults.map((cat) => {
                      const isFavorited = user?.favoriteCats.includes(cat._id) || false;
                      return (
                        <div key={cat._id} className="cat-card" onClick={() => setSelectedCat(cat)}>
                          <div className="cat-image-wrapper" style={{ height: "160px" }}>
                            <img
                              src={cat.image || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600"}
                              alt={cat.name}
                              className="cat-image"
                            />
                            <button
                              className={`favorite-btn ${isFavorited ? "active" : ""}`}
                              onClick={(e) => toggleFavorite(cat._id, e)}
                            >
                              <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
                            </button>
                          </div>
                          <div className="cat-details" style={{ padding: "16px" }}>
                            <span className="cat-breed-tag" style={{ fontSize: "10px" }}>{cat.breed}</span>
                            <h3 className="cat-name" style={{ fontSize: "18px", marginBottom: "4px" }}>{cat.name}</h3>
                            <p className="cat-desc" style={{ fontSize: "13px", WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {cat.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Recommendations */}
              {!loadingAdvisor && advisorAiResult && (
                <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "30px", boxShadow: "var(--shadow-md)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", color: "var(--primary)" }}>
                    <Sparkles size={24} />
                    <h3 style={{ fontSize: "20px", margin: 0 }}>Gemini AI Advisory Report</h3>
                  </div>
                  <div className="ai-report-body" style={{ color: "var(--text)", lineHeight: "1.6" }}>
                    {parseMarkdownToHtml(advisorAiResult)}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Tab Contents: 3. AI Consultant Chat */}
        {activeTab === "ai-chat" && (
          <section style={{ maxWidth: "800px", margin: "0 auto 60px" }}>
            <div className="ai-consultant-card">
              <div className="ai-header">
                <div className="ai-avatar">
                  <PawPrint size={20} />
                </div>
                <div className="ai-meta">
                  <h3>AI Feline Expert</h3>
                  <span className="ai-status">Online</span>
                </div>
              </div>

              <div className="chat-messages">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.sender}`}>
                    <div className="msg-bubble">
                      {msg.sender === "assistant" ? parseMarkdownToHtml(msg.text) : <p>{msg.text}</p>}
                    </div>
                  </div>
                ))}
                {sendingChat && (
                  <div className="chat-message assistant">
                    <div className="msg-bubble">
                      <div className="loading-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              <form onSubmit={handleSendChat} className="chat-input-area">
                <input
                  type="text"
                  placeholder="Ask about cat care, behaviors, feeding schedules..."
                  className="chat-input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={sendingChat}
                />
                <button type="submit" className="btn-send" disabled={sendingChat || !chatInput.trim()}>
                  <ChevronRight size={20} />
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Tab Contents: 4. Favorites */}
        {activeTab === "favorites" && user && (
          <section>
            <h2 style={{ fontSize: "24px", marginBottom: "24px" }}>My Saved Feline Companions</h2>
            {favoritedCats.length === 0 ? (
              <div className="empty-state">
                <Heart size={48} className="empty-icon" />
                <h3>No Favorites Yet</h3>
                <p>When browsing the catalog, click the heart icon on any cat card to save them here!</p>
                <button className="btn-primary nav-btn" style={{ marginTop: "10px" }} onClick={() => setActiveTab("all-cats")}>
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="cat-grid">
                {favoritedCats.map((cat) => (
                  <div key={cat._id} className="cat-card" onClick={() => setSelectedCat(cat)}>
                    <div className="cat-image-wrapper">
                      <img
                        src={cat.image || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600"}
                        alt={cat.name}
                        className="cat-image"
                      />
                      <button
                        className="favorite-btn active"
                        onClick={(e) => toggleFavorite(cat._id, e)}
                      >
                        <Heart size={18} fill="currentColor" />
                      </button>
                    </div>
                    <div className="cat-details">
                      <span className="cat-breed-tag">{cat.breed}</span>
                      <h2 className="cat-name">{cat.name}</h2>
                      <p className="cat-desc">{cat.description}</p>
                      
                      <div className="cat-tags">
                        {cat.kidsFriendly && <span className="tag tag-kids">Kids Friendly</span>}
                        {cat.apartmentFriendly && <span className="tag tag-apartment">Apartment Friendly</span>}
                      </div>

                      <div className="cat-card-footer">
                        <span className="cat-info-item">
                          <Clock size={14} />
                          {cat.lifespan} years
                        </span>
                        <button className="btn-card-details">
                          <span>Details</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-logo">
            <PawPrint size={18} className="logo-icon" />
            <span>TinayCat Advisory</span>
          </div>
          <p className="footer-text">© 2026 TinayCat. Made with love for tiny felines.</p>
        </div>
      </footer>

      {/* Authentication Modal */}
      {authModal.isOpen && (
        <div className="modal-overlay" onClick={() => setAuthModal({ ...authModal, isOpen: false })}>
          <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setAuthModal({ ...authModal, isOpen: false })}>
              <X size={20} />
            </button>

            <div className="auth-header">
              <h2 className="auth-title">
                {authModal.type === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="auth-subtitle">
                {authModal.message || (authModal.type === "login"
                  ? "Log in to customize preferences and favorite cats"
                  : "Sign up to track recommendations and chat history")}
              </p>
            </div>

            {authError && <div className="alert-message alert-error">{authError}</div>}
            {authSuccess && <div className="alert-message alert-success">{authSuccess}</div>}

            <form onSubmit={handleAuthSubmit} className="auth-form">
              {authModal.type === "signup" && (
                <div className="form-group">
                  <label htmlFor="auth-name">Full Name</label>
                  <input
                    type="text"
                    id="auth-name"
                    required
                    className="form-control"
                    placeholder="Enter your name"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="auth-email">Email Address</label>
                <input
                  type="email"
                  id="auth-email"
                  required
                  className="form-control"
                  placeholder="Enter email address"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="auth-password">Password</label>
                <input
                  type="password"
                  id="auth-password"
                  required
                  className="form-control"
                  placeholder="Create secure password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
              </div>

              <button type="submit" className="auth-submit-btn">
                {authModal.type === "login" ? "Login" : "Sign Up"}
              </button>
            </form>

            <div className="auth-switch">
              {authModal.type === "login" ? "New to TinayCat? " : "Already have an account? "}
              <button
                className="auth-switch-btn"
                onClick={() =>
                  setAuthModal({
                    ...authModal,
                    type: authModal.type === "login" ? "signup" : "login",
                  })
                }
              >
                {authModal.type === "login" ? "Register Here" : "Login Here"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cat Details Modal */}
      {selectedCat && (
        <div className="modal-overlay" onClick={() => setSelectedCat(null)}>
          <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCat(null)} style={{ backgroundColor: "rgba(255,255,255,0.8)", zIndex: 10 }}>
              <X size={20} />
            </button>

            <div className="details-image-wrapper">
              <img
                src={selectedCat.image || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600"}
                alt={selectedCat.name}
                className="details-image"
              />
            </div>

            <div className="details-body">
              <div className="details-header">
                <span className="details-breed">{selectedCat.breed}</span>
                <h2 className="details-title">{selectedCat.name}</h2>
              </div>

              <p className="details-desc">{selectedCat.description}</p>

              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Coloration</span>
                  <span className="detail-val">
                    <Palette size={16} style={{ color: "var(--primary)" }} />
                    {selectedCat.color || "Varying"}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Life Span</span>
                  <span className="detail-val">
                    <Clock size={16} style={{ color: "var(--primary)" }} />
                    {selectedCat.lifespan} Years
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Energy Level</span>
                  <span className="detail-val">
                    <Zap size={16} style={{ color: "var(--primary)" }} />
                    {selectedCat.energyLevel}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Suite For Children</span>
                  <span className="detail-val">
                    <Baby size={16} style={{ color: "var(--primary)" }} />
                    {selectedCat.kidsFriendly ? "Highly Suitable" : "Not Recommended"}
                  </span>
                </div>

                <div className="detail-item" style={{ gridColumn: "span 2" }}>
                  <span className="detail-label">Apartment Adaptability</span>
                  <span className="detail-val">
                    <Home size={16} style={{ color: "var(--primary)" }} />
                    {selectedCat.apartmentFriendly
                      ? "Excellent - highly adaptable to small spaces"
                      : "Low Adaptability - requires wide yards or enclosures"}
                  </span>
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: "100%", padding: "12px", borderRadius: "var(--radius-full)", fontWeight: 600 }}
                onClick={() => setSelectedCat(null)}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
