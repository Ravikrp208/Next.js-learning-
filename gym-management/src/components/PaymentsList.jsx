"use client";
import React, { useState } from "react";
import { 
  DollarSign, Search, CreditCard, Receipt, Plus, X, 
  CheckCircle, FileText, Calendar, Wallet, Check 
} from "lucide-react";

export default function PaymentsList({ 
  payments, members, plans, onLogPayment, onUpdateMember, settings 
}) {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  
  // New Payment Form Modal
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    memberId: "",
    planId: plans[0]?.id || "",
    amount: plans[0]?.price || "",
    method: "UPI"
  });

  const { symbol = "₹" } = settings;

  const handleOpenPay = () => {
    // Pick the first member if available
    const firstMember = members[0];
    const plan = plans.find(p => p.id === (firstMember?.planId || plans[0]?.id));
    setPaymentForm({
      memberId: firstMember?.id || "",
      planId: plan ? plan.id : plans[0]?.id || "",
      amount: plan ? plan.price : "",
      method: "UPI"
    });
    setIsPayOpen(true);
  };

  const handleMemberChange = (e) => {
    const memberId = e.target.value;
    const member = members.find(m => m.id === memberId);
    const plan = plans.find(p => p.id === (member?.planId || plans[0]?.id));
    setPaymentForm({
      ...paymentForm,
      memberId,
      planId: plan ? plan.id : plans[0]?.id || "",
      amount: plan ? plan.price : ""
    });
  };

  const handlePlanChange = (e) => {
    const planId = e.target.value;
    const plan = plans.find(p => p.id === planId);
    setPaymentForm({
      ...paymentForm,
      planId,
      amount: plan ? plan.price : ""
    });
  };

  const submitPayment = (e) => {
    e.preventDefault();
    if (!paymentForm.memberId || !paymentForm.amount) return;

    const member = members.find(m => m.id === paymentForm.memberId);
    const plan = plans.find(p => p.id === paymentForm.planId);

    if (!member) return;

    onLogPayment({
      memberId: member.id,
      memberName: member.name,
      amount: Number(paymentForm.amount),
      method: paymentForm.method,
      planName: plan ? plan.name : "Custom Plan"
    });

    // Automatically update member status to active and update plan
    onUpdateMember(member.id, { 
      status: "active", 
      planId: paymentForm.planId 
    });

    setIsPayOpen(false);
  };

  // Calculations for summary card
  const totalRevenue = payments.reduce((acc, pay) => acc + Number(pay.amount || 0), 0);
  const upiTotal = payments.filter(p => p.method === "UPI").reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const cashTotal = payments.filter(p => p.method === "Cash").reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const cardTotal = payments.filter(p => p.method === "Card").reduce((acc, p) => acc + Number(p.amount || 0), 0);

  // Filter payments
  const filteredPayments = payments.filter(pay => {
    const matchesSearch = pay.memberName.toLowerCase().includes(search.toLowerCase()) || pay.planName.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === "all" || pay.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Billing & Payments</h1>
          <p className="mt-1 text-sm text-zinc-400">Record payments, manage invoicing, and track gross gym income.</p>
        </div>
        <button
          onClick={handleOpenPay}
          className="flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-lime-300 transition-all glow-lime self-start sm:self-auto"
        >
          <Plus className="h-5 w-5 stroke-[2.5]" />
          <span>Record Fee</span>
        </button>
      </div>

      {/* Revenue Split cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        {/* Total revenue */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 bg-zinc-900/20">
          <span className="text-xs font-semibold text-zinc-400 block mb-1">Total Revenue</span>
          <span className="text-2xl font-extrabold text-white">{symbol}{totalRevenue.toLocaleString()}</span>
        </div>
        {/* UPI split */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400 block mb-1">UPI Transactions</span>
          <span className="text-xl font-bold text-white">{symbol}{upiTotal.toLocaleString()}</span>
        </div>
        {/* Cash split */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400 block mb-1">Cash Collection</span>
          <span className="text-xl font-bold text-white">{symbol}{cashTotal.toLocaleString()}</span>
        </div>
        {/* Card split */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400 block mb-1">Card Terminal</span>
          <span className="text-xl font-bold text-white">{symbol}{cardTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute top-3.5 left-4 h-4.5 w-4.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search payments by member name or plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all"
          />
        </div>

        {/* Payment Method filter */}
        <div className="flex overflow-x-auto gap-1.5 p-1 rounded-xl bg-zinc-900/40 border border-zinc-800/60 self-start md:self-auto">
          {["all", "UPI", "Cash", "Card"].map((method) => (
            <button
              key={method}
              onClick={() => setMethodFilter(method)}
              className={`rounded-lg px-4 py-2 text-xs font-bold capitalize tracking-wide transition-all ${
                methodFilter === method
                  ? "bg-zinc-800 text-lime-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Logs List */}
      <div className="glass-card rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-850 bg-zinc-900/40 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 pl-6">Receipt</th>
                <th className="p-4">Member</th>
                <th className="p-4">Date</th>
                <th className="p-4">Plan Name</th>
                <th className="p-4">Method</th>
                <th className="p-4 text-right pr-6">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-sm text-zinc-300">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((pay) => (
                  <tr 
                    key={pay.id} 
                    onClick={() => setSelectedReceipt(pay)}
                    className="hover:bg-zinc-900/40 cursor-pointer transition-all"
                  >
                    <td className="p-4 pl-6 font-semibold text-lime-400 flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-zinc-500" />
                      <span>{pay.id.toUpperCase()}</span>
                    </td>
                    <td className="p-4 font-bold text-white">{pay.memberName}</td>
                    <td className="p-4">{pay.date}</td>
                    <td className="p-4">{pay.planName}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                        pay.method === "UPI" 
                          ? "bg-sky-950/40 border-sky-800/40 text-sky-400"
                          : pay.method === "Card"
                          ? "bg-purple-950/40 border-purple-800/40 text-purple-400"
                          : "bg-amber-950/40 border-amber-800/40 text-amber-400"
                      }`}>
                        {pay.method}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6 font-extrabold text-white">
                      {symbol}{pay.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-zinc-500 text-sm">
                    No transactions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-1 text-lime-400">
                <Receipt className="h-5 w-5" />
                <span className="text-sm font-bold tracking-widest uppercase">Transaction Receipt</span>
              </div>
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="rounded-lg p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="space-y-4 rounded-xl border border-zinc-900 p-4 bg-zinc-900/10">
              {/* Gym info */}
              <div className="text-center pb-4 border-b border-dashed border-zinc-900">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">{settings.gymName}</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Payment confirmation voucher</p>
              </div>

              {/* Receipt info */}
              <div className="grid grid-cols-2 gap-y-3 text-xs">
                <div>
                  <span className="text-zinc-500 block">Receipt No.</span>
                  <span className="font-bold text-white uppercase">{selectedReceipt.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 block">Date & Time</span>
                  <span className="font-bold text-zinc-300">{selectedReceipt.date}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Member Name</span>
                  <span className="font-bold text-white">{selectedReceipt.memberName}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 block">Member ID</span>
                  <span className="font-semibold text-zinc-400">{selectedReceipt.memberId}</span>
                </div>
              </div>

              {/* Purchase Details */}
              <div className="mt-4 pt-4 border-t border-zinc-900 space-y-2">
                <div className="flex justify-between text-xs font-bold text-white bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-850">
                  <span>{selectedReceipt.planName}</span>
                  <span className="text-lime-400">{symbol}{selectedReceipt.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] px-2 text-zinc-400">
                  <span>Payment Gateway / Method</span>
                  <span className="font-bold text-zinc-300">{selectedReceipt.method}</span>
                </div>
              </div>

              {/* Paid Stamp */}
              <div className="flex justify-center pt-4">
                <div className="flex items-center gap-1 bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 rounded-full px-4 py-1 text-xs font-extrabold uppercase tracking-widest animate-pulse-glow">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Paid Successful</span>
                </div>
              </div>
            </div>

            {/* Print action simulation */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  alert("Download/Print function simulated successfully!");
                  setSelectedReceipt(null);
                }}
                className="flex-1 rounded-xl bg-lime-400 py-3 text-xs font-bold text-zinc-950 hover:bg-lime-300 transition-all text-center glow-lime"
              >
                Download Receipt PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record payment Modal */}
      {isPayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="text-xl font-extrabold text-white">Record Fee Payment</h2>
              <button 
                onClick={() => setIsPayOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {members.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-zinc-500">Please register members first before recording payments.</p>
              </div>
            ) : (
              <form onSubmit={submitPayment} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Select Member</label>
                  <select
                    value={paymentForm.memberId}
                    onChange={handleMemberChange}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Select Plan</label>
                  <select
                    value={paymentForm.planId}
                    onChange={handlePlanChange}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
