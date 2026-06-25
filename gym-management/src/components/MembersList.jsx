"use client";
import React, { useState, useEffect } from "react";
import { 
  Search, Plus, Filter, Trash2, Edit2, Check, X, Eye, 
  Calendar, Phone, Mail, Dumbbell, CreditCard, ChevronRight, UserMinus
} from "lucide-react";

export default function MembersList({ 
  members, plans, attendance, payments, onAddMember, onUpdateMember, onDeleteMember, onLogPayment, onCheckIn, settings, quickAction, setQuickAction
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);

  // Forms
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: new Date().toISOString().split("T")[0],
    planId: plans[0]?.id || "",
    status: "active",
    photo: ""
  });
  
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "UPI",
    planId: ""
  });

  const { symbol = "₹" } = settings;

  // Sync state if quick action is triggered from dashboard
  useEffect(() => {
    if (quickAction === "add") {
      resetForm();
      setIsAddOpen(true);
      setQuickAction(null);
    }
  }, [quickAction]);

  const resetForm = () => {
    setMemberForm({
      name: "",
      email: "",
      phone: "",
      joinDate: new Date().toISOString().split("T")[0],
      planId: plans[0]?.id || "",
      status: "active",
      photo: ""
    });
  };

  const handleOpenEdit = (member) => {
    setMemberForm(member);
    setIsEditOpen(true);
  };

  const handleOpenPay = (member) => {
    setSelectedMember(member);
    const plan = plans.find(p => p.id === member.planId);
    setPaymentForm({
      amount: plan ? plan.price : "",
      method: "UPI",
      planId: member.planId
    });
    setIsPayOpen(true);
  };

  const submitAddMember = (e) => {
    e.preventDefault();
    if (!memberForm.name || !memberForm.phone) return;
    
    // Choose a default fitness avatar if photo is empty
    const avatarNum = Math.floor(Math.random() * 10) + 1;
    const photoUrl = memberForm.photo || `https://images.unsplash.com/photo-${[
      "1534438327276-14e5300c3a48", "1517838277536-f5f99be501cd", 
      "1507398941214-572c25f4b1bc", "1506794778202-cad84cf45f1d",
      "1500648767791-00dcc994a43e", "1539571696357-5a69c17a67c6",
      "1501196354995-cbb51c65aaea", "1522075469751-3a6694fb2f61"
    ][avatarNum % 8]}?q=80&w=250&auto=format&fit=crop`;

    onAddMember({ ...memberForm, photo: photoUrl });
    setIsAddOpen(false);
    resetForm();
  };

  const submitEditMember = (e) => {
    e.preventDefault();
    onUpdateMember(memberForm.id, memberForm);
    setIsEditOpen(false);
    
    // If selected member is updated, refresh selectedMember state
    if (selectedMember && selectedMember.id === memberForm.id) {
      setSelectedMember({ ...selectedMember, ...memberForm });
    }
    resetForm();
  };

  const submitPayment = (e) => {
    e.preventDefault();
    const plan = plans.find(p => p.id === paymentForm.planId);
    onLogPayment({
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      amount: Number(paymentForm.amount),
      method: paymentForm.method,
      planName: plan ? plan.name : "Custom Plan"
    });
    // Update member status to active
    onUpdateMember(selectedMember.id, { status: "active", planId: paymentForm.planId });
    if (selectedMember) {
      setSelectedMember({ ...selectedMember, status: "active", planId: paymentForm.planId });
    }
    setIsPayOpen(false);
  };

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.includes(search);
      
    const matchesStatus = 
      statusFilter === "all" || 
      member.status === statusFilter ||
      (statusFilter === "expiring" && member.status === "active" && member.name === "KL Rahul");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Gym Members</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage registrations, payments, and member records.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAddOpen(true); }}
          className="flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-lime-300 transition-all glow-lime self-start sm:self-auto"
        >
          <Plus className="h-5 w-5 stroke-[2.5]" />
          <span>New Registration</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute top-3.5 left-4 h-4.5 w-4.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all"
          />
        </div>
        
        {/* Status Filter buttons */}
        <div className="flex overflow-x-auto gap-1.5 p-1 rounded-xl bg-zinc-900/40 border border-zinc-800/60 self-start md:self-auto">
          {["all", "active", "expired", "expiring"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-2 text-xs font-bold capitalize tracking-wide transition-all ${
                statusFilter === status
                  ? "bg-zinc-800 text-lime-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => {
          const plan = plans.find(p => p.id === member.planId);
          const isExpiring = member.name === "KL Rahul" && member.status === "active";
          return (
            <div 
              key={member.id} 
              className={`glass-card glass-card-hover rounded-2xl p-5 border flex flex-col justify-between ${
                selectedMember?.id === member.id ? "border-lime-500 ring-1 ring-lime-500 bg-zinc-900" : ""
              }`}
            >
              <div>
                {/* Image and Status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-14 w-14 rounded-2xl object-cover border border-zinc-800"
                    />
                    <div>
                      <h3 className="font-bold text-white leading-tight">{member.name}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">{member.phone}</p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  {member.status === "expired" ? (
                    <span className="rounded-full bg-rose-950/60 border border-rose-800/50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-rose-400">
                      Expired
                    </span>
                  ) : isExpiring ? (
                    <span className="rounded-full bg-amber-950/60 border border-amber-800/50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-400 animate-pulse">
                      Expiring
                    </span>
                  ) : (
                    <span className="rounded-full bg-lime-950/60 border border-lime-800/50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-lime-400">
                      Active
                    </span>
                  )}
                </div>

                {/* Plan Info */}
                <div className="mt-5 space-y-2 rounded-xl bg-zinc-950/40 border border-zinc-900 p-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Plan Type</span>
                    <span className="font-bold text-zinc-300">{plan ? plan.name : "None"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Joining Date</span>
                    <span className="font-medium text-zinc-400">{member.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex gap-2 border-t border-zinc-900 pt-4">
                <button
                  onClick={() => setSelectedMember(member)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-2.5 text-xs font-bold text-zinc-300 hover:text-white transition-all"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Details</span>
                </button>
                
                <button
                  onClick={() => handleOpenPay(member)}
                  className="flex items-center justify-center rounded-xl bg-lime-400/10 border border-lime-400/20 hover:bg-lime-400/20 p-2.5 text-lime-400 transition-all"
                  title="Record Fee Payment"
                >
                  <CreditCard className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 p-2.5 text-zinc-400 hover:text-white transition-all"
                  title="Edit Profile"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Details Drawer/Overlay */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className="h-full w-full max-w-lg bg-zinc-950 border-l border-zinc-800 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <h2 className="text-xl font-extrabold text-white">Profile Details</h2>
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Main Info */}
              <div className="flex items-center gap-4 bg-zinc-900/30 rounded-2xl p-4 border border-zinc-900">
                <img
                  src={selectedMember.photo}
                  alt={selectedMember.name}
                  className="h-20 w-20 rounded-2xl object-cover border border-zinc-800"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedMember.name}</h3>
                  <div className="mt-2 space-y-1 text-xs text-zinc-400">
                    <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-lime-400" /> {selectedMember.phone}</p>
                    <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-lime-400" /> {selectedMember.email}</p>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-4 text-center">
                  <span className="text-xs text-zinc-500 block mb-1">Status</span>
                  {selectedMember.status === "active" ? (
                    <span className="rounded-full bg-lime-950/40 border border-lime-800/30 px-3 py-1 text-xs font-bold text-lime-400 uppercase tracking-wider inline-block">Active</span>
                  ) : (
                    <span className="rounded-full bg-rose-950/40 border border-rose-800/30 px-3 py-1 text-xs font-bold text-rose-400 uppercase tracking-wider inline-block">Expired</span>
                  )}
                </div>
                <div className="glass-card rounded-xl p-4 text-center">
                  <span className="text-xs text-zinc-500 block mb-1">Plan Enrolled</span>
                  <span className="text-sm font-bold text-white block">
                    {plans.find(p => p.id === selectedMember.planId)?.name || "None"}
                  </span>
                </div>
              </div>

              {/* Attendance Log */}
              <div>
                <h4 className="text-sm font-bold text-white mb-2.5 flex items-center gap-1.5"><Calendar className="h-4.5 w-4.5 text-lime-400" /> Attendance logs (7 days)</h4>
                <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl border border-zinc-900 p-3 bg-zinc-950/40">
                  {attendance.filter(a => a.memberId === selectedMember.id).length > 0 ? (
                    attendance.filter(a => a.memberId === selectedMember.id).map(a => (
                      <div key={a.id} className="flex justify-between text-xs py-1.5 border-b border-zinc-900/60 last:border-0">
                        <span className="text-zinc-400 font-semibold">{a.date}</span>
                        <span className="text-lime-400 font-medium">{a.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-zinc-600">No attendance logs found</div>
                  )}
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h4 className="text-sm font-bold text-white mb-2.5 flex items-center gap-1.5"><CreditCard className="h-4.5 w-4.5 text-lime-400" /> Payment History</h4>
                <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl border border-zinc-900 p-3 bg-zinc-950/40">
                  {payments.filter(p => p.memberId === selectedMember.id).length > 0 ? (
                    payments.filter(p => p.memberId === selectedMember.id).map(p => (
                      <div key={p.id} className="flex justify-between items-center text-xs py-2 border-b border-zinc-900/60 last:border-0">
                        <div>
                          <p className="text-zinc-300 font-bold">{p.planName}</p>
                          <p className="text-[10px] text-zinc-500">{p.date} • {p.method}</p>
                        </div>
                        <span className="text-lime-400 font-bold">{symbol}{p.amount.toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-zinc-600">No payment logs found</div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Panel Actions */}
            <div className="border-t border-zinc-900 pt-5 mt-6 flex gap-3">
              <button
                onClick={() => {
                  onCheckIn(selectedMember.id, selectedMember.name)
                    .then(() => alert(`${selectedMember.name} checked in successfully!`))
                    .catch(err => alert(err.message));
                }}
                disabled={selectedMember.status === "expired"}
                className={`flex-1 rounded-xl py-3 text-sm font-bold text-zinc-950 transition-all text-center ${
                  selectedMember.status === "expired"
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-750"
                    : "bg-lime-400 hover:bg-lime-300 glow-lime"
                }`}
              >
                Log Check-In
              </button>

              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to remove ${selectedMember.name}? This action is permanent.`)) {
                    onDeleteMember(selectedMember.id);
                    setSelectedMember(null);
                  }
                }}
                className="flex items-center justify-center rounded-xl bg-rose-950/30 border border-rose-900/40 hover:bg-rose-900/20 p-3 text-rose-400 transition-all"
                title="Remove Member"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="text-xl font-extrabold text-white">Add New Member</h2>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitAddMember} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="e.g. Virat Kohli"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    placeholder="e.g. virat@gmail.com"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={memberForm.joinDate}
                    onChange={(e) => setMemberForm({ ...memberForm, joinDate: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Initial Membership Plan</label>
                  <select
                    value={memberForm.planId}
                    onChange={(e) => setMemberForm({ ...memberForm, planId: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none"
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({symbol}{p.price})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Avatar / Photo URL (Optional)</label>
                <input
                  type="text"
                  value={memberForm.photo}
                  onChange={(e) => setMemberForm({ ...memberForm, photo: e.target.value })}
                  placeholder="Unsplash image URL or leave blank for a default avatar"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-2.5 px-5 text-sm font-bold text-zinc-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-lime-300 transition-all glow-lime"
                >
                  Save Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="text-xl font-extrabold text-white">Edit Profile</h2>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitEditMember} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Status</label>
                  <select
                    value={memberForm.status}
                    onChange={(e) => setMemberForm({ ...memberForm, status: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Membership Plan</label>
                  <select
                    value={memberForm.planId}
                    onChange={(e) => setMemberForm({ ...memberForm, planId: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none"
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({symbol}{p.price})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Photo URL</label>
                <input
                  type="text"
                  value={memberForm.photo}
                  onChange={(e) => setMemberForm({ ...memberForm, photo: e.target.value })}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-2.5 px-5 text-sm font-bold text-zinc-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-lime-300 transition-all glow-lime"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Fee Payment Modal */}
      {isPayOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="text-xl font-extrabold text-white">Record Fee</h2>
              <button 
                onClick={() => setIsPayOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Collecting Fees For</p>
              <p className="text-lg font-bold text-white mt-1">{selectedMember.name}</p>
            </div>

            <form onSubmit={submitPayment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Select Membership Plan</label>
                <select
                  value={paymentForm.planId}
                  onChange={(e) => {
                    const plan = plans.find(p => p.id === e.target.value);
                    setPaymentForm({
                      ...paymentForm,
                      planId: e.target.value,
                      amount: plan ? plan.price : ""
                    });
                  }}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({symbol}{p.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Amount Paid ({symbol}) *</label>
                <input
                  type="number"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  placeholder="e.g. 1500"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {["UPI", "Cash", "Card"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentForm({ ...paymentForm, method })}
                      className={`rounded-xl border py-2.5 text-xs font-bold transition-all ${
                        paymentForm.method === method
                          ? "bg-lime-400 border-lime-400 text-zinc-950"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setIsPayOpen(false)}
                  className="rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-2.5 px-5 text-sm font-bold text-zinc-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-lime-300 transition-all glow-lime"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
