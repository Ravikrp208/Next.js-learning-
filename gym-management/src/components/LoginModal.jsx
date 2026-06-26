"use client";
import React, { useState } from "react";
import { X, Lock, Mail, Phone, User, Check, Eye, EyeOff, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function LoginModal({ isOpen, onClose, onLoginSuccess, members, onAddMember, plans, defaultPlanId = "", initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // "login" | "register"
  const [loginRole, setLoginRole] = useState("member"); // "member" | "admin"

  // Login form states
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register form states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPlan, setRegPlan] = useState(defaultPlanId || plans[0]?.id || "");

  // Error & Status states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync mode and plan when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      if (defaultPlanId) {
        setRegPlan(defaultPlanId);
      } else {
        setRegPlan(plans[0]?.id || "");
      }
    }
  }, [isOpen, defaultPlanId, initialMode, plans]);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#a3e635", "#ffffff", "#1e293b"]
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (loginRole === "admin") {
      if (adminUser.trim() === "admin" && adminPass === "admin") {
        const user = { role: "admin", name: "Administrator" };
        triggerConfetti();
        onLoginSuccess(user);
        resetForm();
        onClose();
      } else {
        setError("Invalid Admin credentials! (Use admin / admin)");
      }
    } else {
      // Member login by Email or Phone
      if (!emailOrPhone.trim()) {
        setError("Please enter your registered Email or Phone number.");
        return;
      }

      const match = members.find(
        (m) =>
          m.email.toLowerCase() === emailOrPhone.trim().toLowerCase() ||
          m.phone.replace(/\s+/g, "") === emailOrPhone.trim().replace(/\s+/g, "")
      );

      if (match) {
        const user = { role: "member", memberData: match, name: match.name };
        triggerConfetti();
        onLoginSuccess(user);
        resetForm();
        onClose();
      } else {
        setError("No member account found with this Email or Phone. Try registering!");
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    // Check if member already exists
    const exists = members.some(
      (m) =>
        m.email.toLowerCase() === regEmail.trim().toLowerCase() ||
        m.phone.replace(/\s+/g, "") === regPhone.trim().replace(/\s+/g, "")
    );

    if (exists) {
      setError("A member with this Email or Phone is already registered. Try logging in!");
      return;
    }

    const selectedPlan = plans.find((p) => p.id === regPlan);
    const newMember = {
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim(),
      joinDate: new Date().toISOString().split("T")[0],
      planId: regPlan,
      status: "active",
      photo: `https://images.unsplash.com/photo-${[
        "1534438327276-14e5300c3a48",
        "1517838277536-f5f99be501cd",
        "1507398941214-572c25f4b1bc",
        "1506794778202-cad84cf45f1d",
        "1501196354995-cbb51c65aaea",
        "1522075469751-3a6694fb2f61"
      ][Math.floor(Math.random() * 6)]}?q=80&w=250&auto=format&fit=crop`
    };

    try {
      const added = await onAddMember(newMember);
      if (added) {
        setSuccess("Registration successful! Logging you in...");
        triggerConfetti();
        
        setTimeout(() => {
          const user = { role: "member", memberData: added, name: added.name };
          onLoginSuccess(user);
          resetForm();
          onClose();
        }, 1200);
      } else {
        setError("Something went wrong during registration.");
      }
    } catch (err) {
      setError(err.message || "Failed to register member.");
    }
  };

  const resetForm = () => {
    setEmailOrPhone("");
    setAdminUser("");
    setAdminPass("");
    setRegName("");
    setRegEmail("");
    setRegPhone("");
    setError("");
    setSuccess("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all hover:bg-zinc-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Title Header */}
          <div className="text-center space-y-2 mb-6">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400 text-zinc-950 glow-lime">
              {loginRole === "admin" && mode === "login" ? (
                <Shield className="h-6 w-6 stroke-[2.2]" />
              ) : (
                <Lock className="h-6 w-6 stroke-[2.2]" />
              )}
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {mode === "login" ? "Welcome Back" : "Start Your Fitness Journey"}
            </h2>
            <p className="text-xs text-zinc-400">
              {mode === "login"
                ? "Enter your credentials to unlock your FitOS dashboard"
                : "Register now and get instant access to workout logs"}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-900 p-1 mb-6">
            <button
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-zinc-800 text-lime-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-zinc-800 text-lime-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl border border-rose-800/40 bg-rose-950/40 p-3 text-xs font-semibold text-rose-400"
            >
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl border border-emerald-800/40 bg-emerald-950/40 p-3 text-xs font-semibold text-emerald-400 flex items-center gap-2"
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* Mode contents */}
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role Picker */}
              <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 border-b border-zinc-900 pb-3">
                <span className="text-[10px] uppercase tracking-wider text-zinc-600">Login As:</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-zinc-400 hover:text-white">
                  <input
                    type="radio"
                    name="role"
                    checked={loginRole === "member"}
                    onChange={() => {
                      setLoginRole("member");
                      setError("");
                    }}
                    className="accent-lime-400"
                  />
                  <span>Gym Member</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-zinc-400 hover:text-white">
                  <input
                    type="radio"
                    name="role"
                    checked={loginRole === "admin"}
                    onChange={() => {
                      setLoginRole("admin");
                      setError("");
                    }}
                    className="accent-lime-400"
                  />
                  <span>Administrator</span>
                </label>
              </div>

              {loginRole === "member" ? (
                /* MEMBER LOGIN */
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Email or Phone
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-500">
                      <Mail className="h-4.5 w-4.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. virat.kohli@gym.com"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-lime-400 focus:bg-zinc-900"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Tip: Enter Virat Kohli's email or your registered email/phone to test.
                  </p>
                </div>
              ) : (
                /* ADMIN LOGIN */
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-500">
                        <User className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. admin"
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-lime-400 focus:bg-zinc-900"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-500">
                        <Lock className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 pl-11 pr-11 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-lime-400 focus:bg-zinc-900"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3.5 flex items-center text-zinc-500 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-500">
                      Tip: Use admin username <code className="text-lime-400 bg-zinc-900 px-1 rounded">admin</code> and password <code className="text-lime-400 bg-zinc-900 px-1 rounded">admin</code>.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-lime-400 py-3.5 text-sm font-extrabold text-zinc-950 hover:bg-lime-300 transition-all cursor-pointer glow-lime flex items-center justify-center gap-2 mt-4"
              >
                <span>Log In Access</span>
              </button>
            </form>
          ) : (
            /* REGISTER MODE */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-500">
                    <User className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Virat Kohli"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-lime-400 focus:bg-zinc-900"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-500">
                    <Mail className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="email"
                    placeholder="virat@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-lime-400 focus:bg-zinc-900"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-500">
                    <Phone className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-lime-400 focus:bg-zinc-900"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Select Gym Plan
                </label>
                <select
                  value={regPlan}
                  onChange={(e) => setRegPlan(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 px-4 text-sm text-white outline-none transition-all focus:border-lime-400 focus:bg-zinc-900 cursor-pointer"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id} className="bg-zinc-950 text-white">
                      {p.name} — ₹{p.price} ({p.durationMonths} Mon)
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-lime-400 py-3.5 text-sm font-extrabold text-zinc-950 hover:bg-lime-300 transition-all cursor-pointer glow-lime flex items-center justify-center gap-2 mt-4"
              >
                <span>Register & Log In</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
