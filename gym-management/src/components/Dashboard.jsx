"use client";
import React, { useState, useEffect } from "react";
import { 
  Users, UserCheck, DollarSign, Activity, AlertTriangle, 
  TrendingUp, ArrowRight, UserPlus, CreditCard, CheckSquare 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie 
} from "recharts";

export default function Dashboard({ 
  members, attendance, payments, plans, settings, setActiveTab, setQuickAction 
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { symbol = "₹" } = settings;

  // 1. Calculations for Stats
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === "active").length;
  const expiredMembers = members.filter(m => m.status === "expired").length;

  const todayStr = new Date().toISOString().split("T")[0];
  const attendanceToday = attendance.filter(a => a.date === todayStr).length;

  const totalRevenue = payments.reduce((acc, pay) => acc + Number(pay.amount || 0), 0);

  // 2. Data for Charts
  // A. Attendance last 7 days
  const getAttendanceData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = attendance.filter(a => a.date === dateStr).length;
      
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      data.push({ name: dayName, count });
    }
    return data;
  };

  // B. Revenue per month (mock months)
  const getRevenueData = () => {
    // Group payments by Month
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    const monthlyTotals = {};
    months.forEach(m => { monthlyTotals[m] = 0; });

    payments.forEach(pay => {
      const payDate = new Date(pay.date);
      if (payDate.getFullYear() === currentYear) {
        const monthName = months[payDate.getMonth()];
        monthlyTotals[monthName] += Number(pay.amount || 0);
      }
    });

    return months.map(m => ({ name: m, amount: monthlyTotals[m] })).filter(m => m.amount > 0 || m.name === "Jun"); // Show data up to current month
  };

  // C. Membership Plans Pie Chart
  const getPlanData = () => {
    const counts = {};
    plans.forEach(p => { counts[p.name] = 0; });
    
    members.forEach(m => {
      const plan = plans.find(p => p.id === m.planId);
      if (plan) {
        counts[plan.name] = (counts[plan.name] || 0) + 1;
      }
    });

    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    })).filter(item => item.value > 0);
  };

  const attendanceData = getAttendanceData();
  const revenueData = getRevenueData();
  const planData = getPlanData();

  // Color Palette for Pie Chart
  const COLORS = ["#a3e635", "#38bdf8", "#c084fc", "#fb923c"];

  // D. Upcoming Expiring Members (in the next 7 days or already expired)
  // For safety in this demo, members without valid dates are treated as active,
  // but we can check members whose joining date + duration is close to now.
  const getExpiringMembers = () => {
    return members
      .filter(m => m.status === "expired" || (m.status === "active" && m.name === "KL Rahul")) // KL Rahul mock expiring
      .slice(0, 4);
  };

  const expiringMembers = getExpiringMembers();

  // E. Recent check-ins
  const recentCheckins = attendance.slice(0, 5);

  // F. Recent Payments
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Fitness Analytics
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Real-time insights and gym management dashboard.
          </p>
        </div>
        
        {/* Quick Actions Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setActiveTab("attendance"); setQuickAction("checkin"); }}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800"
          >
            <CheckSquare className="h-4.5 w-4.5 text-lime-400" />
            <span>Check-In Member</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("members"); setQuickAction("add"); }}
            className="flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-bold text-zinc-950 transition-all hover:bg-lime-300 glow-lime"
          >
            <UserPlus className="h-4.5 w-4.5 stroke-[2.5]" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Members */}
        <div className="glass-card glass-card-hover rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Total Members</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">{totalMembers}</span>
            <div className="mt-1.5 flex items-center gap-1 text-xs text-lime-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+{members.filter(m => new Date(m.joinDate).getMonth() === new Date().getMonth()).length} this month</span>
            </div>
          </div>
        </div>

        {/* Active Members */}
        <div className="glass-card glass-card-hover rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Active Members</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-950/40 text-lime-400 border border-lime-800/40">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">{activeMembers}</span>
            <div className="mt-1.5 flex items-center gap-1 text-xs text-zinc-400">
              <span className="font-semibold text-lime-400">
                {totalMembers ? Math.round((activeMembers / totalMembers) * 100) : 0}%
              </span>
              <span>retention rate</span>
            </div>
          </div>
        </div>

        {/* Attendance Today */}
        <div className="glass-card glass-card-hover rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Checked-In Today</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">{attendanceToday}</span>
            <div className="mt-1.5 flex items-center gap-1 text-xs text-zinc-400">
              <span>Peak hours: 6:00 AM - 8:00 AM</span>
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="glass-card glass-card-hover rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Gross Income</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-950/40 text-lime-400 border border-lime-800/40">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">
              {symbol}
              {totalRevenue.toLocaleString()}
            </span>
            <div className="mt-1.5 flex items-center gap-1 text-xs text-lime-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Healthy revenue flow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance Chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Daily Attendance</h3>
              <p className="text-xs text-zinc-400">Check-in volume over the last 7 days</p>
            </div>
          </div>
          <div className="h-72 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a3e635" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px", color: "#fff" }}
                    labelStyle={{ fontWeight: "bold", color: "#a3e635" }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#a3e635" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAttendance)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-500">Loading charts...</div>
            )}
          </div>
        </div>

        {/* Popular Plans Chart */}
        <div className="glass-card rounded-2xl p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Plan Distribution</h3>
            <p className="text-xs text-zinc-400">Popularity of membership tiers</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            {mounted && planData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {planData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px", color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-zinc-500">No member data to display</div>
            )}
          </div>
          {/* Legend */}
          <div className="mt-2 space-y-2">
            {planData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-zinc-300 font-medium">{item.name}</span>
                </div>
                <span className="text-white font-bold">{item.value} {item.value === 1 ? 'member' : 'members'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row charts and activities */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Revenue Chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Monthly Income</h3>
              <p className="text-xs text-zinc-400">Gross revenue generation by month</p>
            </div>
          </div>
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                  <Tooltip
                    formatter={(value) => [`${symbol}${value.toLocaleString()}`, "Revenue"]}
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px", color: "#fff" }}
                  />
                  <Bar dataKey="amount" fill="#a3e635" radius={[6, 6, 0, 0]}>
                    {revenueData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === "Jun" ? "#a3e635" : "#3f3f46"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-500">Loading charts...</div>
            )}
          </div>
        </div>

        {/* Expiring memberships Alerts */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Alerts & Expirations</h3>
            </div>
            
            <div className="space-y-4">
              {expiringMembers.length > 0 ? (
                expiringMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-xl bg-zinc-900/60 p-3 border border-zinc-800/80">
                    <div className="flex items-center gap-3">
                      <img 
                        src={member.photo || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=100"} 
                        alt={member.name}
                        className="h-9 w-9 rounded-full object-cover border border-zinc-800"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">{member.name}</p>
                        <p className="text-[11px] text-zinc-400">{member.phone}</p>
                      </div>
                    </div>
                    <div>
                      {member.status === "expired" ? (
                        <span className="rounded-full bg-rose-950/60 border border-rose-800/50 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                          Expired
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                          3 Days Left
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-zinc-500">All member plans are active!</div>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => setActiveTab("members")}
            className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white transition-all bg-zinc-900/20"
          >
            <span>Manage All Members</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity Feed */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Attendance Check-Ins */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-lime-400" />
            <span>Recent Check-Ins</span>
          </h3>
          <div className="divide-y divide-zinc-800/50">
            {recentCheckins.length > 0 ? (
              recentCheckins.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-950/20 text-lime-400 border border-lime-800/20">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{log.memberName}</p>
                      <p className="text-[10px] text-zinc-400">Member ID: {log.memberId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-lime-400">{log.time}</p>
                    <p className="text-[10px] text-zinc-500">{log.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-zinc-500">No recent check-ins</div>
            )}
          </div>
        </div>

        {/* Recent Payments logs */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="h-4.5 w-4.5 text-lime-400" />
            <span>Recent Payments</span>
          </h3>
          <div className="divide-y divide-zinc-800/50">
            {recentPayments.length > 0 ? (
              recentPayments.map((pay) => (
                <div key={pay.id} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/20 text-emerald-400 border border-emerald-800/20">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{pay.memberName}</p>
                      <p className="text-[10px] text-zinc-400">{pay.planName} via {pay.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{symbol}{pay.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-zinc-500">{pay.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-zinc-500">No payments recorded yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
