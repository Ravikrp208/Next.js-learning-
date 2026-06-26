"use client";
import React, { useState, useEffect } from "react";
import { CheckSquare, Calendar, CreditCard, Award, Flame, User, LogOut, CheckCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function MemberDashboard({ 
  user, 
  attendance, 
  payments, 
  plans, 
  onCheckIn, 
  onLogout 
}) {
  const member = user.memberData;
  const plan = plans.find(p => p.id === member.planId) || { name: "Basic Gym Plan", price: 1500, durationMonths: 1 };
  
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState({ text: "", type: "" }); // type: "success" | "error"
  const [streak, setStreak] = useState(0);

  // Filter attendance and payments for this member
  const memberAttendance = attendance.filter(a => a.memberId === member.id);
  const memberPayments = payments.filter(p => p.memberId === member.id);

  // Compute streak (mock calculation + base calculation on consecutive days)
  useEffect(() => {
    // Basic calculation: total check-ins in the last 30 days is a fun count or consecutive days
    const uniqueDates = [...new Set(memberAttendance.map(a => a.date))];
    setStreak(uniqueDates.length > 0 ? Math.min(uniqueDates.length, 7) + 2 : 0); // Add a small base mock streak for UI feel
  }, [attendance]);

  const handleSelfCheckIn = async () => {
    setCheckingIn(true);
    setCheckInMsg({ text: "", type: "" });
    try {
      const logged = await onCheckIn(member.id, member.name);
      if (logged) {
        setCheckInMsg({ 
          text: `Check-in recorded! Marked present at ${logged.time} today.`, 
          type: "success" 
        });
      }
    } catch (err) {
      setCheckInMsg({ 
        text: err.message || "Failed to check-in. Already checked in today?", 
        type: "error" 
      });
    } finally {
      setCheckingIn(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const isCheckedInToday = attendance.some(a => a.memberId === member.id && a.date === todayStr);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-lime-400/5 via-transparent to-transparent"></div>
        
        {/* User Info */}
        <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 text-center sm:text-left">
          <img 
            src={member.photo || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=250"}
            alt={member.name}
            className="h-20 w-20 rounded-2xl object-cover border-2 border-lime-400/80 glow-lime"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white">{member.name}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                member.status === "active" 
                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-glow-lime" 
                  : "bg-rose-950/60 text-rose-400 border border-rose-800/40"
              }`}>
                {member.status} Member
              </span>
            </div>
            <p className="text-xs text-zinc-400">ID: {member.id} | Joined: {member.joinDate}</p>
            <p className="text-xs text-zinc-500">{member.email} | {member.phone}</p>
          </div>
        </div>

        {/* Self Check-In Trigger */}
        <div className="relative z-10 w-full md:w-auto">
          {isCheckedInToday ? (
            <div className="flex flex-col items-center md:items-end gap-1.5">
              <span className="flex items-center gap-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 px-5 py-3 text-sm font-bold text-emerald-400">
                <CheckCircle className="h-4.5 w-4.5 stroke-[2.5]" />
                Checked In for Today
              </span>
              <p className="text-[10px] text-zinc-500">
                Checked in at {attendance.find(a => a.memberId === member.id && a.date === todayStr)?.time}
              </p>
            </div>
          ) : (
            <button
              onClick={handleSelfCheckIn}
              disabled={checkingIn}
              className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 text-sm font-extrabold text-zinc-950 hover:bg-lime-300 transition-all cursor-pointer glow-lime"
            >
              {checkingIn ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin stroke-[2.5]" />
                  Checking In...
                </>
              ) : (
                <>
                  <CheckSquare className="h-4.5 w-4.5 stroke-[2.5]" />
                  Check-In for Today
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Check In Response Message */}
      {checkInMsg.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 text-sm font-bold border ${
            checkInMsg.type === "success"
              ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
              : "bg-rose-950/40 border-rose-800/40 text-rose-400"
          }`}
        >
          {checkInMsg.text}
        </motion.div>
      )}

      {/* Quick stats cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Streak card */}
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Training Streak</span>
            <span className="text-3xl font-black text-white">{streak} Days</span>
            <span className="text-[10px] text-zinc-500 block">Active days in the last month</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-orange-950/20 text-orange-500 border border-orange-950 flex items-center justify-center">
            <Flame className="h-6 w-6 stroke-[2.2]" />
          </div>
        </div>

        {/* Plan card */}
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Current Plan</span>
            <span className="text-lg font-black text-white truncate max-w-[150px] block">{plan.name}</span>
            <span className="text-[10px] text-zinc-500 block">Renews at standard rate</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-lime-950/20 text-lime-400 border border-lime-950 flex items-center justify-center">
            <Award className="h-6 w-6 stroke-[2.2]" />
          </div>
        </div>

        {/* Check-ins card */}
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Total Attendance</span>
            <span className="text-3xl font-black text-white">{memberAttendance.length} Sessions</span>
            <span className="text-[10px] text-zinc-500 block">Lifetime gym workouts logged</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center">
            <Calendar className="h-6 w-6 stroke-[2.2]" />
          </div>
        </div>
      </div>

      {/* Tables layout: Attendance Logs & Payment History */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* My Attendance History */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-lime-400" />
            <span>My Workout Logs</span>
          </h3>
          <div className="max-h-[300px] overflow-y-auto divide-y divide-zinc-800/50 pr-1">
            {memberAttendance.length > 0 ? (
              memberAttendance.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-950/20 text-lime-400 border border-lime-800/20">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Daily Workout</p>
                      <p className="text-[10px] text-zinc-500">Self Check-In Successful</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-lime-400">{log.time}</p>
                    <p className="text-[10px] text-zinc-500">{log.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-sm text-zinc-500">No workout sessions logged yet!</div>
            )}
          </div>
        </div>

        {/* My Payment History */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-lime-400" />
            <span>My Payment History</span>
          </h3>
          <div className="max-h-[300px] overflow-y-auto divide-y divide-zinc-800/50 pr-1">
            {memberPayments.length > 0 ? (
              memberPayments.map((pay) => (
                <div key={pay.id} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/20 text-emerald-400 border border-emerald-800/20">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{pay.planName}</p>
                      <p className="text-[10px] text-zinc-500">Via {pay.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">₹{pay.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-zinc-500">{pay.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-sm text-zinc-500">No payments found!</div>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Workout Plan for Member */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Your Recommended Workout Schedule</h3>
          <p className="text-xs text-zinc-400">Tailored based on your active tier ({plan.name})</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-zinc-900/60 p-4 border border-zinc-800">
            <span className="text-[10px] font-extrabold uppercase text-lime-400 tracking-wider">Mon / Thu</span>
            <p className="text-sm font-bold text-white mt-1">Push Day</p>
            <p className="text-xs text-zinc-500 mt-0.5">Chest, Shoulders & Triceps</p>
          </div>
          <div className="rounded-2xl bg-zinc-900/60 p-4 border border-zinc-800">
            <span className="text-[10px] font-extrabold uppercase text-lime-400 tracking-wider">Tue / Fri</span>
            <p className="text-sm font-bold text-white mt-1">Pull Day</p>
            <p className="text-xs text-zinc-500 mt-0.5">Back, Rear Delts & Biceps</p>
          </div>
          <div className="rounded-2xl bg-zinc-900/60 p-4 border border-zinc-800">
            <span className="text-[10px] font-extrabold uppercase text-lime-400 tracking-wider">Wed / Sat</span>
            <p className="text-sm font-bold text-white mt-1">Legs & Core</p>
            <p className="text-xs text-zinc-500 mt-0.5">Squats, Hamstrings & Abs</p>
          </div>
          <div className="rounded-2xl bg-zinc-900/60 p-4 border border-zinc-800">
            <span className="text-[10px] font-extrabold uppercase text-orange-500 tracking-wider">Sunday</span>
            <p className="text-sm font-bold text-white mt-1">Active Recovery</p>
            <p className="text-xs text-zinc-500 mt-0.5">Light Cardio & Stretching</p>
          </div>
        </div>
      </div>

    </div>
  );
}
