"use client";
import React, { useState, useEffect } from "react";
import { 
  CheckSquare, Activity, Search, ShieldCheck, ShieldAlert, 
  ArrowRight, UserCheck, Trash2, Clock, CheckCircle, RefreshCw 
} from "lucide-react";
import confetti from "canvas-confetti";

export default function AttendanceLogs({ 
  members, attendance, onCheckIn, settings, quickAction, setQuickAction 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [checkedInMember, setCheckedInMember] = useState(null);
  const [checkInError, setCheckInError] = useState("");
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [timerId, setTimerId] = useState(null);

  // Trigger search on input change
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const results = members.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.phone.includes(searchTerm)
      );
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, members]);

  // Handle quick action check-in from dashboard
  useEffect(() => {
    if (quickAction === "checkin") {
      setSearchTerm("");
      setQuickAction(null);
    }
  }, [quickAction]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#a3e635", "#10b981", "#ffffff"]
    });
  };

  const handleCheckIn = async (member) => {
    setSearchTerm("");
    setSearchResults([]);
    setCheckInError("");
    setCheckedInMember(member);
    setShowResultScreen(true);

    if (member.status === "expired") {
      // Access denied
      setCheckInError("Membership has expired. Please clear dues to check in.");
      return;
    }

    try {
      // Log check-in
      await onCheckIn(member.id, member.name);
      triggerConfetti();
      
      // Auto-hide the popup after 4 seconds
      if (timerId) clearTimeout(timerId);
      const newTimer = setTimeout(() => {
        setShowResultScreen(false);
        setCheckedInMember(null);
      }, 4000);
      setTimerId(newTimer);
    } catch (err) {
      setCheckInError(err.message || "Failed to log check-in.");
    }
  };

  // Group attendance by date
  const todayStr = new Date().toISOString().split("T")[0];
  const todayLogs = attendance.filter(log => log.date === todayStr);
  const historicalLogs = attendance.filter(log => log.date !== todayStr);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left: Terminal Card */}
      <div className="glass-card rounded-2xl p-6 lg:col-span-1 flex flex-col justify-between min-h-[450px]">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-950/40 text-lime-400 border border-lime-800/40">
              <CheckSquare className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Check-In Terminal</h2>
              <p className="text-xs text-zinc-400">Mark daily member attendance</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute top-3.5 left-4 h-4.5 w-4.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search member name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all"
            />

            {/* Live Search dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 z-10 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden divide-y divide-zinc-800/80">
                {searchResults.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleCheckIn(member)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-zinc-850/80 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={member.photo} 
                        alt={member.name}
                        className="h-8 w-8 rounded-lg object-cover" 
                      />
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">{member.name}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{member.phone}</p>
                      </div>
                    </div>
                    <div>
                      {member.status === "expired" ? (
                        <span className="rounded-full bg-rose-950/40 border border-rose-800/50 px-2 py-0.5 text-[9px] font-extrabold uppercase text-rose-400">
                          Expired
                        </span>
                      ) : (
                        <span className="rounded-full bg-lime-950/40 border border-lime-800/50 px-2 py-0.5 text-[9px] font-extrabold uppercase text-lime-400">
                          Active
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Display Result Screen */}
        <div className="mt-6 flex-1 flex items-center justify-center border border-dashed border-zinc-800 rounded-2xl p-4 bg-zinc-900/10 min-h-[220px]">
          {showResultScreen && checkedInMember ? (
            <div className="text-center space-y-4 w-full animate-fade-in">
              <div className="flex justify-center">
                {checkInError ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-950/40 border border-rose-800/40 text-rose-400 animate-bounce">
                    <ShieldAlert className="h-8 w-8 stroke-[2]" />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-950/40 border border-lime-800/40 text-lime-400 glow-lime animate-pulse-glow">
                    <ShieldCheck className="h-8 w-8 stroke-[2]" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-white text-lg">{checkedInMember.name}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{checkedInMember.phone}</p>
              </div>

              {checkInError ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-rose-400 bg-rose-950/20 border border-rose-800/30 rounded-xl py-2 px-3">
                    {checkInError}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-lime-400 font-extrabold uppercase tracking-widest text-glow-lime">
                    Access Granted
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Checked in at {new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}

              <button 
                onClick={() => { setShowResultScreen(false); setCheckedInMember(null); }}
                className="text-[11px] font-bold text-zinc-500 hover:text-white transition-all underline decoration-dotted"
              >
                Clear Terminal Screen
              </button>
            </div>
          ) : (
            <div className="text-center text-zinc-500 p-4 space-y-2">
              <Clock className="h-8 w-8 text-zinc-700 mx-auto animate-pulse" />
              <p className="text-sm font-semibold">Ready for Check-In</p>
              <p className="text-xs max-w-xs mx-auto">Use the search bar above to look up a member and log their daily attendance.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Today's Logs (middle column) & History (right column) */}
      <div className="glass-card rounded-2xl p-6 lg:col-span-2 space-y-6 flex flex-col justify-between">
        <div>
          {/* Header Stats */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-lime-400" />
              <h2 className="text-lg font-bold text-white">Daily Check-In Log</h2>
            </div>
            <span className="rounded-full bg-lime-950/40 border border-lime-800/40 px-3 py-1 text-xs font-bold text-lime-400">
              {todayLogs.length} Checked In Today
            </span>
          </div>

          {/* Today's logs list */}
          <div className="max-h-96 overflow-y-auto space-y-2 divide-y divide-zinc-900/40">
            {todayLogs.length > 0 ? (
              todayLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-3 first:pt-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-950/20 text-lime-400 border border-lime-800/10">
                      <UserCheck className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">{log.memberName}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">ID: {log.memberId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-xs font-bold text-lime-400">{log.time}</p>
                      <p className="text-[9px] text-zinc-500">{log.date}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-zinc-600 text-sm">
                No check-ins recorded today yet.
              </div>
            )}
          </div>
        </div>

        {/* Historical Logs summary */}
        {historicalLogs.length > 0 && (
          <div className="border-t border-zinc-900 pt-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Attendance History</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Group historical logs by date */}
              {Array.from(new Set(historicalLogs.map(l => l.date))).slice(0, 3).map(date => {
                const count = historicalLogs.filter(l => l.date === date).length;
                return (
                  <div key={date} className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-zinc-500">{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <span className="text-sm font-extrabold text-white mt-1">{count} check-ins</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
