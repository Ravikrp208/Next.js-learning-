"use client";
import React, { useState } from "react";
import { 
  Cloud, CloudOff, RefreshCw, Copy, Check, Info, 
  Trash2, RotateCcw, Save, ShieldAlert, CheckCircle 
} from "lucide-react";

export default function Settings({ 
  settings, onSaveSettings, onResetDatabase, onClearAllData, onPullFromSheets, onPushToSheets 
}) {
  const [form, setForm] = useState({ ...settings });
  const [copySuccess, setCopySuccess] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);
  
  // Sync Actions Loading State
  const [pulling, setPulling] = useState(false);
  const [pushing, setPushing] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings(form);
    alert("Settings saved successfully!");
  };

  const handleTestConnection = async () => {
    if (!form.appsScriptUrl) {
      setTestResult({ success: false, message: "Apps Script Web App URL is required" });
      return;
    }

    setTestingConnection(true);
    setTestResult(null);

    try {
      const res = await fetch(`/api/sheets?url=${encodeURIComponent(form.appsScriptUrl)}`);
      const data = await res.json();
      
      if (data.success) {
        setTestResult({ 
          success: true, 
          message: `Connected successfully! Found ${data.members?.length || 0} members, ${data.attendance?.length || 0} check-ins, and ${data.payments?.length || 0} payments.` 
        });
      } else {
        setTestResult({ success: false, message: data.error || "Failed to connect to Apps Script" });
      }
    } catch (err) {
      setTestResult({ success: false, message: err.message || "Network error. Make sure URL is correct and deployed as 'Anyone' can access." });
    } finally {
      setTestingConnection(false);
    }
  };

  const handlePull = async () => {
    if (!settings.appsScriptUrl) return;
    setPulling(true);
    const res = await onPullFromSheets(settings.appsScriptUrl);
    setPulling(false);
    if (res.success) {
      alert("Successfully pulled all data from Google Sheets to Local Storage!");
      window.location.reload(); // Refresh to reload data in state
    } else {
      alert(`Pull failed: ${res.error}`);
    }
  };

  const handlePush = async () => {
    if (!settings.appsScriptUrl) return;
    if (confirm("This will overwrite your existing Google Sheet data with your local database. Proceed?")) {
      setPushing(true);
      const res = await onPushToSheets(settings.appsScriptUrl);
      setPushing(false);
      if (res.success) {
        alert("Successfully pushed local database to Google Sheets!");
      } else {
        alert(`Push failed: ${res.error}`);
      }
    }
  };

  const copyCode = () => {
    const code = `/**
 * Google Apps Script for Gym Management System Database Sync
 * 
 * Instructions:
 * 1. Open Google Sheets (sheets.google.com).
 * 2. Create a blank spreadsheet and name it (e.g., "Gym Management DB").
 * 3. In the menu, go to Extensions > Apps Script.
 * 4. Delete any code in the editor and paste this code.
 * 5. Click Save (disk icon).
 * 6. Click "Deploy" (top right) > "New deployment".
 * 7. Choose type: "Web app".
 * 8. Set Configuration:
 *    - Description: "Gym DB Sync API"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (Required so your web app can communicate with it).
 * 9. Click "Deploy".
 * 10. Copy the "Web app URL" and paste it into the Settings tab of your Gym Management Web App.
 */

function initDatabase(ss) {
  const sheetsInfo = [
    { name: "Members", headers: ["id", "name", "email", "phone", "joinDate", "planId", "status", "photo"] },
    { name: "Attendance", headers: ["id", "memberId", "memberName", "date", "time"] },
    { name: "Payments", headers: ["id", "memberId", "memberName", "amount", "date", "method", "planName"] }
  ];
  sheetsInfo.forEach(info => {
    let sheet = ss.getSheetByName(info.name);
    if (!sheet) {
      sheet = ss.insertSheet(info.name);
      sheet.appendRow(info.headers);
      sheet.getRange(1, 1, 1, info.headers.length).setFontWeight("bold").setBackground("#18181b").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
  });
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  initDatabase(ss);
  const result = {
    members: getSheetData(ss.getSheetByName("Members")),
    attendance: getSheetData(ss.getSheetByName("Attendance")),
    payments: getSheetData(ss.getSheetByName("Payments"))
  };
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  initDatabase(ss);
  let responseData = { success: false, error: "Unknown error" };
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const payload = postData.data;
    if (action === "syncAll") {
      syncSheetData(ss.getSheetByName("Members"), payload.members, ["id", "name", "email", "phone", "joinDate", "planId", "status", "photo"]);
      syncSheetData(ss.getSheetByName("Attendance"), payload.attendance, ["id", "memberId", "memberName", "date", "time"]);
      syncSheetData(ss.getSheetByName("Payments"), payload.payments, ["id", "memberId", "memberName", "amount", "date", "method", "planName"]);
      responseData = { success: true, message: "Bulk data synchronized successfully" };
    } else if (action === "addMember") {
      appendRowData(ss.getSheetByName("Members"), payload, ["id", "name", "email", "phone", "joinDate", "planId", "status", "photo"]);
      responseData = { success: true };
    } else if (action === "updateMember") {
      updateRowData(ss.getSheetByName("Members"), payload.id, payload, ["id", "name", "email", "phone", "joinDate", "planId", "status", "photo"]);
      responseData = { success: true };
    } else if (action === "deleteMember") {
      deleteRowData(ss.getSheetByName("Members"), payload.id);
      responseData = { success: true };
    } else if (action === "addAttendance") {
      appendRowData(ss.getSheetByName("Attendance"), payload, ["id", "memberId", "memberName", "date", "time"]);
      responseData = { success: true };
    } else if (action === "addPayment") {
      appendRowData(ss.getSheetByName("Payments"), payload, ["id", "memberId", "memberName", "amount", "date", "method", "planName"]);
      responseData = { success: true };
    }
  } catch (err) { responseData = { success: false, error: err.toString() }; }
  return ContentService.createTextOutput(JSON.stringify(responseData)).setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => {
      let val = row[i];
      if (val instanceof Date) val = val.toISOString().split('T')[0];
      obj[h] = val;
    });
    return obj;
  });
}

function appendRowData(sheet, obj, headerOrder) {
  sheet.appendRow(headerOrder.map(h => obj[h] || ""));
}

function updateRowData(sheet, id, obj, headerOrder) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      headerOrder.forEach((h, colIdx) => {
        if (obj[h] !== undefined) sheet.getRange(i + 1, colIdx + 1).setValue(obj[h]);
      });
      return;
    }
  }
  appendRowData(sheet, obj, headerOrder);
}

function deleteRowData(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) { sheet.deleteRow(i + 1); return; }
  }
}

function syncSheetData(sheet, list, headerOrder) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, headerOrder.length).clearContent();
  if (!list || list.length === 0) return;
  sheet.getRange(2, 1, list.length, headerOrder.length).setValues(list.map(item => headerOrder.map(h => item[h] || "")));
}`;

    navigator.clipboard.writeText(code).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      
      {/* Left Column: General Configuration & Database Actions */}
      <div className="space-y-6 lg:col-span-1">
        
        {/* Gym Configuration Card */}
        <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-900 pb-3">
            <Save className="h-4.5 w-4.5 text-lime-400" />
            <span>Gym Settings</span>
          </h2>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">Gym Name</label>
            <input
              type="text"
              value={form.gymName}
              onChange={(e) => setForm({ ...form, gymName: e.target.value })}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">Currency Symbol</label>
            <input
              type="text"
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-white focus:border-lime-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-lime-400 py-3 text-sm font-bold text-zinc-950 hover:bg-lime-300 transition-all glow-lime"
          >
            Save Settings
          </button>
        </form>

        {/* Database Management Card */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-900 pb-3">
            <RotateCcw className="h-4.5 w-4.5 text-lime-400" />
            <span>Database Management</span>
          </h2>

          <p className="text-xs text-zinc-400">Manage your local storage state. Ideal for debugging or switching from sheets.</p>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                if (confirm("Reset local database to pre-populated mock members and payment history? Any unsaved changes will be lost.")) {
                  onResetDatabase();
                  alert("Database reset successfully!");
                  window.location.reload();
                }
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-3 text-xs font-bold text-white transition-all"
            >
              <RotateCcw className="h-4 w-4 text-amber-400" />
              <span>Reset to Demo Data</span>
            </button>

            <button
              onClick={() => {
                if (confirm("Danger! This will delete ALL registrations, attendance logs, and payment data. Proceed?")) {
                  onClearAllData();
                  alert("All local data deleted.");
                  window.location.reload();
                }
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-950/20 border border-rose-900/30 hover:bg-rose-900/20 py-3 text-xs font-bold text-rose-400 transition-all"
            >
              <Trash2 className="h-4 w-4" />
              <span>Wipe Local Database</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Google Sheets ("Stitch") Integration */}
      <div className="glass-card rounded-2xl p-6 lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-lime-400" />
            <h2 className="text-lg font-bold text-white">Google Sheets Sync</h2>
          </div>
          
          {/* Status Badge */}
          {settings.googleSheetsEnabled ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Enabled
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 text-xs font-bold text-zinc-400">
              <CloudOff className="h-3.5 w-3.5" /> Local Mode
            </span>
          )}
        </div>

        {/* Integration form */}
        <div className="space-y-4">
          {/* Enable toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-850">
            <div>
              <span className="text-sm font-bold text-white block">Enable Google Sheets Database</span>
              <span className="text-xs text-zinc-500 mt-0.5">Use a Google Sheet spreadsheet as your central web database</span>
            </div>
            <button
              onClick={() => {
                const updated = { ...form, googleSheetsEnabled: !form.googleSheetsEnabled };
                setForm(updated);
                onSaveSettings(updated);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                form.googleSheetsEnabled ? "bg-lime-400" : "bg-zinc-800"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-950 shadow ring-0 transition duration-200 ease-in-out ${
                  form.googleSheetsEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Web App URL Input */}
          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">Google Apps Script Web App URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={form.appsScriptUrl}
                onChange={(e) => setForm({ ...form, appsScriptUrl: e.target.value })}
                className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-xs text-white placeholder-zinc-600 focus:border-lime-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 px-4 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
              >
                {testingConnection ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                <span>Test Connection</span>
              </button>
            </div>
          </div>

          {/* Test results indicator */}
          {testResult && (
            <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
              testResult.success 
                ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400"
                : "bg-rose-950/20 border-rose-900/30 text-rose-400"
            }`}>
              {testResult.success ? (
                <>
                  <CheckCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <p>{testResult.message}</p>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <p>{testResult.message}</p>
                </>
              )}
            </div>
          )}

          {/* Bulk sync operations */}
          {settings.googleSheetsEnabled && settings.appsScriptUrl && (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-900">
              <button
                type="button"
                onClick={handlePull}
                disabled={pulling}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 py-3 text-xs font-bold text-zinc-300 hover:text-white transition-all"
              >
                {pulling ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Cloud className="h-3.5 w-3.5" />}
                <span>Pull Sheet To Local</span>
              </button>

              <button
                type="button"
                onClick={handlePush}
                disabled={pushing}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-lime-400/10 border border-lime-400/20 hover:bg-lime-400/20 py-3 text-xs font-bold text-lime-400 transition-all"
              >
                {pushing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Cloud className="h-3.5 w-3.5" />}
                <span>Push Local To Sheet</span>
              </button>
            </div>
          )}
        </div>

        {/* Set up guide accordion */}
        <div className="border-t border-zinc-900 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Info className="h-4.5 w-4.5 text-lime-400" />
            <span>Setup Instructions</span>
          </h3>

          <div className="space-y-3.5 text-xs text-zinc-400 leading-relaxed">
            <p>To connect Google Sheets as your database, deploy a simple Google Apps Script Web App:</p>
            <ol className="list-decimal pl-4 space-y-2.5">
              <li>Open Google Sheets and create a blank sheet.</li>
              <li>Go to <strong>Extensions &gt; Apps Script</strong>.</li>
              <li>Delete all contents in the code editor, click the copy button below, and paste the code.</li>
              <li>Click Save (disk icon) and click <strong>Deploy &gt; New deployment</strong>.</li>
              <li>Set type to <strong>Web App</strong>, description to "Gym Sync API", execute as "Me" (your email), and set who has access to <strong>"Anyone"</strong>. Click Deploy.</li>
              <li>Copy the <strong>"Web App URL"</strong>, paste it in the field above, toggle "Enable Google Sheets Database" on, and click <strong>Push Local To Sheet</strong> to initialize your sheet structure with demo records.</li>
            </ol>

            {/* Copy button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={copyCode}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 py-3 text-xs font-bold text-white transition-all"
              >
                {copySuccess ? (
                  <>
                    <Check className="h-4.5 w-4.5 text-lime-400" />
                    <span className="text-lime-400">Apps Script Code Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4.5 w-4.5" />
                    <span>Copy Google Apps Script Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
