"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import MembersList from "@/components/MembersList";
import AttendanceLogs from "@/components/AttendanceLogs";
import PaymentsList from "@/components/PaymentsList";
import Settings from "@/components/Settings";
import LandingPage from "@/components/LandingPage";
import MemberDashboard from "@/components/MemberDashboard";
import LoginModal from "@/components/LoginModal";
import { db, DEFAULT_PLANS } from "@/utils/db";
import { Dumbbell, RefreshCw, CloudLightning } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [quickAction, setQuickAction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedPlanForReg, setSelectedPlanForReg] = useState("");
  const [initialModeForModal, setInitialModeForModal] = useState("login");

  // Database states
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [settings, setSettings] = useState({});

  // Sync state
  const [isSynced, setIsSynced] = useState(false);

  // Initialize and load database
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      db.init();

      const savedSettings = db.getSettings();
      setSettings(savedSettings);
      setIsSynced(savedSettings.googleSheetsEnabled && !!savedSettings.appsScriptUrl);

      // Load session
      const savedSession = localStorage.getItem("fitos_session");
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          if (session.role === "member") {
            const currentMembers = db.getMembers();
            const match = currentMembers.find(m => m.id === session.memberData.id);
            if (match) {
              session.memberData = match;
            }
          }
          setCurrentUser(session);
          if (session.role === "admin") {
            setActiveTab("dashboard");
          } else if (session.role === "member") {
            setActiveTab("member-portal");
          }
        } catch (err) {
          console.error("Initial session parse error:", err);
          setActiveTab("home");
        }
      } else {
        setActiveTab("home");
      }

      // If Google Sheets is enabled and URL is configured, pull latest data on load
      if (savedSettings.googleSheetsEnabled && savedSettings.appsScriptUrl) {
        try {
          const res = await db.pullFromGoogleSheets(savedSettings.appsScriptUrl);
          if (!res.success) {
            console.warn("Initial Google Sheets pull failed, falling back to local data:", res.error);
          }
        } catch (err) {
          console.error("Initial load sync error:", err);
        }
      }

      // Load into local React state (after optional pull)
      setMembers(db.getMembers());
      setAttendance(db.getAttendance());
      setPayments(db.getPayments());
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Sync state checker
  const updateSyncStatus = (updatedSettings) => {
    setIsSynced(updatedSettings.googleSheetsEnabled && !!updatedSettings.appsScriptUrl);
  };

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    localStorage.setItem("fitos_session", JSON.stringify(user));
    setCurrentUser(user);
    if (user.role === "admin") {
      setActiveTab("dashboard");
    } else if (user.role === "member") {
      setActiveTab("member-portal");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fitos_session");
    setCurrentUser(null);
    setActiveTab("home");
  };

  const handleOpenRegister = (planId = "") => {
    setSelectedPlanForReg(planId);
    setInitialModeForModal("register");
    setLoginModalOpen(true);
  };

  // Database operations wrapped with state updates
  const handleAddMember = async (newMember) => {
    const added = await db.addMember(newMember);
    setMembers(db.getMembers());
    return added;
  };

  const handleUpdateMember = async (id, updatedData) => {
    const updated = await db.updateMember(id, updatedData);
    setMembers(db.getMembers());
    return updated;
  };

  const handleDeleteMember = async (id) => {
    await db.deleteMember(id);
    setMembers(db.getMembers());
    // Also remove their attendance & payments from local state (optionally synced)
    setAttendance(db.getAttendance());
    setPayments(db.getPayments());
  };

  const handleLogAttendance = async (memberId, memberName) => {
    const log = await db.logAttendance(memberId, memberName);
    setAttendance(db.getAttendance());
    return log;
  };

  const handleLogPayment = async (payment) => {
    const log = await db.logPayment(payment);
    setPayments(db.getPayments());
    return log;
  };

  const handleSaveSettings = (newSettings) => {
    db.saveSettings(newSettings);
    setSettings(newSettings);
    updateSyncStatus(newSettings);
  };

  const handleResetDatabase = () => {
    db.reset();
    const freshSettings = db.getSettings();
    setSettings(freshSettings);
    setMembers(db.getMembers());
    setAttendance(db.getAttendance());
    setPayments(db.getPayments());
    updateSyncStatus(freshSettings);
  };

  const handleClearAllData = () => {
    db.clearAll();
    setMembers([]);
    setAttendance([]);
    setPayments([]);
  };

  const handlePullFromSheets = async (url) => {
    const res = await db.pullFromGoogleSheets(url);
    if (res.success) {
      setMembers(db.getMembers());
      setAttendance(db.getAttendance());
      setPayments(db.getPayments());
    }
    return res;
  };

  const handlePushToSheets = async (url) => {
    return await db.pushToGoogleSheets(url);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-950 gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400 text-zinc-950 glow-lime animate-spin">
          <Dumbbell className="h-8 w-8 stroke-[2.5]" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-white tracking-widest uppercase">Loading FitOS</p>
          <p className="text-xs text-zinc-500">Initializing members and cloud database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        gymName={settings.gymName || "Alpha Iron Gym"} 
        isSynced={isSynced}
        currentUser={currentUser}
        onLoginClick={() => {
          setSelectedPlanForReg("");
          setInitialModeForModal("login");
          setLoginModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "home" && (
          <LandingPage 
            plans={DEFAULT_PLANS}
            onOpenLogin={() => {
              setSelectedPlanForReg("");
              setInitialModeForModal("login");
              setLoginModalOpen(true);
            }}
            onOpenRegister={handleOpenRegister}
            gymName={settings.gymName || "Alpha Iron Gym"}
          />
        )}

        {activeTab === "member-portal" && currentUser?.role === "member" && (
          <MemberDashboard 
            user={currentUser}
            attendance={attendance}
            payments={payments}
            plans={DEFAULT_PLANS}
            onCheckIn={handleLogAttendance}
            onLogout={handleLogout}
          />
        )}

        {activeTab === "dashboard" && currentUser?.role === "admin" && (
          <Dashboard 
            members={members}
            attendance={attendance}
            payments={payments}
            plans={DEFAULT_PLANS}
            settings={settings}
            setActiveTab={setActiveTab}
            setQuickAction={setQuickAction}
          />
        )}

        {activeTab === "members" && currentUser?.role === "admin" && (
          <MembersList 
            members={members}
            plans={DEFAULT_PLANS}
            attendance={attendance}
            payments={payments}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onLogPayment={handleLogPayment}
            onCheckIn={handleLogAttendance}
            settings={settings}
            quickAction={quickAction}
            setQuickAction={setQuickAction}
          />
        )}

        {activeTab === "attendance" && currentUser?.role === "admin" && (
          <AttendanceLogs 
            members={members}
            attendance={attendance}
            onCheckIn={handleLogAttendance}
            settings={settings}
            quickAction={quickAction}
            setQuickAction={setQuickAction}
          />
        )}

        {activeTab === "payments" && currentUser?.role === "admin" && (
          <PaymentsList 
            payments={payments}
            members={members}
            plans={DEFAULT_PLANS}
            onLogPayment={handleLogPayment}
            onUpdateMember={handleUpdateMember}
            settings={settings}
          />
        )}

        {activeTab === "settings" && currentUser?.role === "admin" && (
          <Settings 
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onResetDatabase={handleResetDatabase}
            onClearAllData={handleClearAllData}
            onPullFromSheets={handlePullFromSheets}
            onPushToSheets={handlePushToSheets}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/40 py-6 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} FitOS Systems. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><CloudLightning className="h-3.5 w-3.5 text-lime-400" /> Powered by Google Apps Script Database Sync</span>
          </div>
        </div>
      </footer>

      {/* Login / Register Modal Popup */}
      <LoginModal 
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        members={members}
        onAddMember={handleAddMember}
        plans={DEFAULT_PLANS}
        defaultPlanId={selectedPlanForReg}
        initialMode={initialModeForModal}
      />
    </div>
  );
}
