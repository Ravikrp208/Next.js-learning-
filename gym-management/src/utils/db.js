// LocalStorage & Google Sheets Sync Database Interface

export const DEFAULT_PLANS = [
  { id: "p1", name: "Monthly Standard", price: 1500, durationMonths: 1, description: "Full gym access, cardio & strength areas" },
  { id: "p2", name: "Quarterly Pack", price: 4000, durationMonths: 3, description: "3 Months access + 2 personal trainer sessions" },
  { id: "p3", name: "Annual Elite", price: 12000, durationMonths: 12, description: "12 Months access, lockers, steam bath, PT" },
  { id: "p4", name: "Personal Training", price: 5000, durationMonths: 1, description: "1-on-1 dedicated coach (12 sessions/month)" }
];

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Members
const MOCK_MEMBERS = [
  { id: "m1", name: "Virat Kohli", email: "virat.kohli@gym.com", phone: "+91 98765 43210", joinDate: "2026-01-01", planId: "p3", status: "active", photo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=250&auto=format&fit=crop" },
  { id: "m2", name: "Rohit Sharma", email: "rohit.sharma@gym.com", phone: "+91 98765 43211", joinDate: "2026-02-15", planId: "p2", status: "active", photo: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=250&auto=format&fit=crop" },
  { id: "m3", name: "MS Dhoni", email: "mahendra.dhoni@gym.com", phone: "+91 98765 43212", joinDate: "2026-03-01", planId: "p3", status: "active", photo: "https://images.unsplash.com/photo-1507398941214-572c25f4b1bc?q=80&w=250&auto=format&fit=crop" },
  { id: "m4", name: "Hardik Pandya", email: "hardik.pandya@gym.com", phone: "+91 98765 43213", joinDate: "2026-04-10", planId: "p1", status: "active", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=250&auto=format&fit=crop" },
  { id: "m5", name: "KL Rahul", email: "kl.rahul@gym.com", phone: "+91 98765 43214", joinDate: "2026-05-28", planId: "p1", status: "active", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop" },
  { id: "m6", name: "Rishabh Pant", email: "rishabh.pant@gym.com", phone: "+91 98765 43215", joinDate: "2026-05-15", planId: "p1", status: "expired", photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=250&auto=format&fit=crop" },
  { id: "m7", name: "Jasprit Bumrah", email: "jasprit.bumrah@gym.com", phone: "+91 98765 43216", joinDate: "2026-01-20", planId: "p4", status: "active", photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=250&auto=format&fit=crop" },
  { id: "m8", name: "Suryakumar Yadav", email: "sky.yadav@gym.com", phone: "+91 98765 43217", joinDate: "2026-03-10", planId: "p2", status: "active", photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=250&auto=format&fit=crop" }
];

// Mock Attendance Logs
const MOCK_ATTENDANCE = [
  // Today (June 25, 2026)
  { id: "a1", memberId: "m1", memberName: "Virat Kohli", date: "2026-06-25", time: "06:15 AM" },
  { id: "a2", memberId: "m3", memberName: "MS Dhoni", date: "2026-06-25", time: "07:30 AM" },
  { id: "a3", memberId: "m4", memberName: "Hardik Pandya", date: "2026-06-25", time: "08:00 AM" },
  { id: "a4", memberId: "m7", memberName: "Jasprit Bumrah", date: "2026-06-25", time: "06:45 AM" },
  { id: "a5", memberId: "m8", memberName: "Suryakumar Yadav", date: "2026-06-25", time: "05:50 PM" },

  // June 24
  { id: "a6", memberId: "m1", memberName: "Virat Kohli", date: "2026-06-24", time: "06:10 AM" },
  { id: "a7", memberId: "m2", memberName: "Rohit Sharma", date: "2026-06-24", time: "08:15 AM" },
  { id: "a8", memberId: "m3", memberName: "MS Dhoni", date: "2026-06-24", time: "07:45 AM" },
  { id: "a9", memberId: "m7", memberName: "Jasprit Bumrah", date: "2026-06-24", time: "06:30 AM" },

  // June 23
  { id: "a10", memberId: "m1", memberName: "Virat Kohli", date: "2026-06-23", time: "06:22 AM" },
  { id: "a11", memberId: "m2", memberName: "Rohit Sharma", date: "2026-06-23", time: "08:10 AM" },
  { id: "a12", memberId: "m4", memberName: "Hardik Pandya", date: "2026-06-23", time: "07:50 AM" },
  { id: "a13", memberId: "m5", memberName: "KL Rahul", date: "2026-06-23", time: "09:00 AM" },
  { id: "a14", memberId: "m8", memberName: "Suryakumar Yadav", date: "2026-06-23", time: "06:05 PM" },

  // June 22
  { id: "a15", memberId: "m1", memberName: "Virat Kohli", date: "2026-06-22", time: "06:05 AM" },
  { id: "a16", memberId: "m3", memberName: "MS Dhoni", date: "2026-06-22", time: "07:35 AM" },
  { id: "a17", memberId: "m7", memberName: "Jasprit Bumrah", date: "2026-06-22", time: "06:40 AM" },
  { id: "a18", memberId: "m8", memberName: "Suryakumar Yadav", date: "2026-06-22", time: "05:45 PM" },

  // June 21
  { id: "a19", memberId: "m2", memberName: "Rohit Sharma", date: "2026-06-21", time: "08:20 AM" },
  { id: "a20", memberId: "m4", memberName: "Hardik Pandya", date: "2026-06-21", time: "08:12 AM" },
  { id: "a21", memberId: "m5", memberName: "KL Rahul", date: "2026-06-21", time: "09:15 AM" },

  // June 20
  { id: "a22", memberId: "m1", memberName: "Virat Kohli", date: "2026-06-20", time: "06:12 AM" },
  { id: "a23", memberId: "m2", memberName: "Rohit Sharma", date: "2026-06-20", time: "08:05 AM" },
  { id: "a24", memberId: "m3", memberName: "MS Dhoni", date: "2026-06-20", time: "07:40 AM" },
  { id: "a25", memberId: "m7", memberName: "Jasprit Bumrah", date: "2026-06-20", time: "07:00 AM" },
  { id: "a26", memberId: "m8", memberName: "Suryakumar Yadav", date: "2026-06-20", time: "06:10 PM" },

  // June 19
  { id: "a27", memberId: "m1", memberName: "Virat Kohli", date: "2026-06-19", time: "06:15 AM" },
  { id: "a28", memberId: "m3", memberName: "MS Dhoni", date: "2026-06-19", time: "07:30 AM" },
  { id: "a29", memberId: "m4", memberName: "Hardik Pandya", date: "2026-06-19", time: "08:00 AM" },
  { id: "a30", memberId: "m5", memberName: "KL Rahul", date: "2026-06-19", time: "09:30 AM" }
];

// Mock Payments
const MOCK_PAYMENTS = [
  { id: "pay1", memberId: "m1", memberName: "Virat Kohli", amount: 12000, date: "2026-01-01", method: "UPI", planName: "Annual Elite" },
  { id: "pay2", memberId: "m7", memberName: "Jasprit Bumrah", amount: 5000, date: "2026-01-20", method: "Card", planName: "Personal Training" },
  { id: "pay3", memberId: "m2", memberName: "Rohit Sharma", amount: 4000, date: "2026-02-15", method: "UPI", planName: "Quarterly Pack" },
  { id: "pay4", memberId: "m3", memberName: "MS Dhoni", amount: 12000, date: "2026-03-01", method: "UPI", planName: "Annual Elite" },
  { id: "pay5", memberId: "m8", memberName: "Suryakumar Yadav", amount: 4000, date: "2026-03-10", method: "Cash", planName: "Quarterly Pack" },
  { id: "pay6", memberId: "m4", memberName: "Hardik Pandya", amount: 1500, date: "2026-04-10", method: "UPI", planName: "Monthly Standard" },
  { id: "pay7", memberId: "m7", memberName: "Jasprit Bumrah", amount: 5000, date: "2026-05-20", method: "Card", planName: "Personal Training" },
  { id: "pay8", memberId: "m6", memberName: "Rishabh Pant", amount: 1500, date: "2026-05-15", method: "Cash", planName: "Monthly Standard" },
  { id: "pay9", memberId: "m5", memberName: "KL Rahul", amount: 1500, date: "2026-05-28", method: "UPI", planName: "Monthly Standard" },
  { id: "pay10", memberId: "m4", memberName: "Hardik Pandya", amount: 1500, date: "2026-06-10", method: "UPI", planName: "Monthly Standard" }
];

const getLocal = (key, defaultVal) => {
  if (typeof window === "undefined") return defaultVal;
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : defaultVal;
};

const setLocal = (key, data) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const db = {
  // Initialize Database
  init: () => {
    if (!localStorage.getItem("gym_members")) {
      setLocal("gym_members", MOCK_MEMBERS);
    }
    if (!localStorage.getItem("gym_attendance")) {
      setLocal("gym_attendance", MOCK_ATTENDANCE);
    }
    if (!localStorage.getItem("gym_payments")) {
      setLocal("gym_payments", MOCK_PAYMENTS);
    }
    if (!localStorage.getItem("gym_settings")) {
      setLocal("gym_settings", {
        googleSheetsEnabled: false,
        appsScriptUrl: "",
        gymName: "Alpha Iron Gym",
        currency: "INR",
        symbol: "₹"
      });
    }
  },

  // Reset database to mock data
  reset: () => {
    setLocal("gym_members", MOCK_MEMBERS);
    setLocal("gym_attendance", MOCK_ATTENDANCE);
    setLocal("gym_payments", MOCK_PAYMENTS);
    const settings = getLocal("gym_settings", {});
    settings.googleSheetsEnabled = false;
    settings.appsScriptUrl = "";
    setLocal("gym_settings", settings);
  },

  // Clear all data
  clearAll: () => {
    setLocal("gym_members", []);
    setLocal("gym_attendance", []);
    setLocal("gym_payments", []);
  },

  // Settings
  getSettings: () => getLocal("gym_settings", {
    googleSheetsEnabled: false,
    appsScriptUrl: "",
    gymName: "Alpha Iron Gym",
    currency: "INR",
    symbol: "₹"
  }),
  
  saveSettings: (settings) => {
    setLocal("gym_settings", settings);
  },

  // Members
  getMembers: () => getLocal("gym_members", []),
  
  saveMembersList: (list) => setLocal("gym_members", list),

  addMember: async (member) => {
    const newMember = { id: generateId(), ...member };
    const list = db.getMembers();
    list.unshift(newMember);
    setLocal("gym_members", list);

    // Sync if Google Sheets is enabled
    const settings = db.getSettings();
    if (settings.googleSheetsEnabled && settings.appsScriptUrl) {
      await db.syncAction("addMember", newMember, settings.appsScriptUrl);
    }
    return newMember;
  },

  updateMember: async (id, updatedData) => {
    const list = db.getMembers();
    const index = list.findIndex(m => m.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedData };
      setLocal("gym_members", list);

      // Sync if Google Sheets is enabled
      const settings = db.getSettings();
      if (settings.googleSheetsEnabled && settings.appsScriptUrl) {
        await db.syncAction("updateMember", list[index], settings.appsScriptUrl);
      }
      return list[index];
    }
    return null;
  },

  deleteMember: async (id) => {
    const list = db.getMembers();
    const filtered = list.filter(m => m.id !== id);
    setLocal("gym_members", filtered);

    // Sync if Google Sheets is enabled
    const settings = db.getSettings();
    if (settings.googleSheetsEnabled && settings.appsScriptUrl) {
      await db.syncAction("deleteMember", { id }, settings.appsScriptUrl);
    }
    return true;
  },

  // Attendance
  getAttendance: () => getLocal("gym_attendance", []),

  saveAttendanceList: (list) => setLocal("gym_attendance", list),

  logAttendance: async (memberId, memberName) => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    
    // Check if already checked in today
    const list = db.getAttendance();
    const alreadyCheckedIn = list.some(
      a => a.memberId === memberId && a.date === dateStr
    );

    if (alreadyCheckedIn) {
      throw new Error(`${memberName} has already checked in today!`);
    }

    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    const newLog = {
      id: generateId(),
      memberId,
      memberName,
      date: dateStr,
      time: timeStr
    };

    list.unshift(newLog);
    setLocal("gym_attendance", list);

    // Sync if Google Sheets is enabled
    const settings = db.getSettings();
    if (settings.googleSheetsEnabled && settings.appsScriptUrl) {
      await db.syncAction("addAttendance", newLog, settings.appsScriptUrl);
    }
    return newLog;
  },

  // Payments
  getPayments: () => getLocal("gym_payments", []),

  savePaymentsList: (list) => setLocal("gym_payments", list),

  logPayment: async (payment) => {
    const newPayment = {
      id: generateId(),
      date: new Date().toISOString().split("T")[0],
      ...payment
    };
    const list = db.getPayments();
    list.unshift(newPayment);
    setLocal("gym_payments", list);

    // Sync if Google Sheets is enabled
    const settings = db.getSettings();
    if (settings.googleSheetsEnabled && settings.appsScriptUrl) {
      await db.syncAction("addPayment", newPayment, settings.appsScriptUrl);
    }
    return newPayment;
  },

  // API Client Call to Serverless Proxy
  syncAction: async (action, data, appsScriptUrl) => {
    try {
      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: appsScriptUrl, action, data })
      });
      const resData = await response.json();
      if (!resData.success) {
        console.warn(`Sync failed for action ${action}:`, resData.error);
      }
      return resData;
    } catch (err) {
      console.error(`Sync error for action ${action}:`, err);
      return { success: false, error: err.message };
    }
  },

  // Fetch all sheets and overwrite local data
  pullFromGoogleSheets: async (appsScriptUrl) => {
    try {
      const response = await fetch(`/api/sheets?url=${encodeURIComponent(appsScriptUrl)}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch spreadsheet data");
      }

      if (data.members) db.saveMembersList(data.members);
      if (data.attendance) db.saveAttendanceList(data.attendance);
      if (data.payments) db.savePaymentsList(data.payments);

      return { success: true };
    } catch (err) {
      console.error("Failed to pull from Google Sheets:", err);
      return { success: false, error: err.message };
    }
  },

  // Push local data to Google Sheets (overwrite sheet)
  pushToGoogleSheets: async (appsScriptUrl) => {
    try {
      const payload = {
        members: db.getMembers(),
        attendance: db.getAttendance(),
        payments: db.getPayments()
      };

      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: appsScriptUrl,
          action: "syncAll",
          data: payload
        })
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || "Failed to push spreadsheet data");
      }

      return { success: true };
    } catch (err) {
      console.error("Failed to push to Google Sheets:", err);
      return { success: false, error: err.message };
    }
  }
};
