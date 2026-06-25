/**
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

// Initialize sheets if they do not exist
function initDatabase(ss) {
  const sheetsInfo = [
    {
      name: "Members",
      headers: ["id", "name", "email", "phone", "joinDate", "planId", "status", "photo"]
    },
    {
      name: "Attendance",
      headers: ["id", "memberId", "memberName", "date", "time"]
    },
    {
      name: "Payments",
      headers: ["id", "memberId", "memberName", "amount", "date", "method", "planName"]
    }
  ];

  sheetsInfo.forEach(info => {
    let sheet = ss.getSheetByName(info.name);
    if (!sheet) {
      sheet = ss.insertSheet(info.name);
      sheet.appendRow(info.headers);
      // Format headers: bold and dark background
      sheet.getRange(1, 1, 1, info.headers.length)
        .setFontWeight("bold")
        .setBackground("#18181b")
        .setFontColor("#ffffff");
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

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
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
      // Direct bulk sync from local to sheet (overwriting or merging)
      syncSheetData(ss.getSheetByName("Members"), payload.members, ["id", "name", "email", "phone", "joinDate", "planId", "status", "photo"]);
      syncSheetData(ss.getSheetByName("Attendance"), payload.attendance, ["id", "memberId", "memberName", "date", "time"]);
      syncSheetData(ss.getSheetByName("Payments"), payload.payments, ["id", "memberId", "memberName", "amount", "date", "method", "planName"]);
      responseData = { success: true, message: "Bulk data synchronized successfully" };
    } 
    else if (action === "addMember") {
      const sheet = ss.getSheetByName("Members");
      appendRowData(sheet, payload, ["id", "name", "email", "phone", "joinDate", "planId", "status", "photo"]);
      responseData = { success: true, message: "Member added successfully" };
    } 
    else if (action === "updateMember") {
      const sheet = ss.getSheetByName("Members");
      updateRowData(sheet, payload.id, payload, ["id", "name", "email", "phone", "joinDate", "planId", "status", "photo"]);
      responseData = { success: true, message: "Member updated successfully" };
    }
    else if (action === "deleteMember") {
      const sheet = ss.getSheetByName("Members");
      deleteRowData(sheet, payload.id);
      responseData = { success: true, message: "Member deleted successfully" };
    }
    else if (action === "addAttendance") {
      const sheet = ss.getSheetByName("Attendance");
      appendRowData(sheet, payload, ["id", "memberId", "memberName", "date", "time"]);
      responseData = { success: true, message: "Attendance logged successfully" };
    } 
    else if (action === "addPayment") {
      const sheet = ss.getSheetByName("Payments");
      appendRowData(sheet, payload, ["id", "memberId", "memberName", "amount", "date", "method", "planName"]);
      responseData = { success: true, message: "Payment logged successfully" };
    } 
    else {
      responseData = { success: false, error: "Invalid action: " + action };
    }
  } catch (err) {
    responseData = { success: false, error: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

// Helper to convert sheet rows into array of objects
function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      let val = row[index];
      // Convert dates to ISO strings for frontend
      if (val instanceof Date) {
        val = val.toISOString().split('T')[0];
      }
      obj[header] = val;
    });
    return obj;
  });
}

// Helper to append a single object as a row matching the header order
function appendRowData(sheet, obj, headerOrder) {
  const row = headerOrder.map(header => obj[header] || "");
  sheet.appendRow(row);
}

// Helper to update a row matching a key (id)
function updateRowData(sheet, id, obj, headerOrder) {
  const data = sheet.getDataRange().getValues();
  const idIndex = headerOrder.indexOf("id");
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      const rowNum = i + 1;
      headerOrder.forEach((header, colIdx) => {
        if (obj[header] !== undefined) {
          sheet.getRange(rowNum, colIdx + 1).setValue(obj[header]);
        }
      });
      return true;
    }
  }
  // If not found, append
  appendRowData(sheet, obj, headerOrder);
  return false;
}

// Helper to delete a row by member ID
function deleteRowData(sheet, id) {
  const data = sheet.getDataRange().getValues();
  // Assume "id" is first column (index 0)
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

// Helper to sync whole data (clean & overwrite)
function syncSheetData(sheet, list, headerOrder) {
  // Clear all content below header
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, headerOrder.length).clearContent();
  }
  
  if (!list || list.length === 0) return;
  
  const rows = list.map(item => {
    return headerOrder.map(header => {
      let val = item[header];
      if (val === undefined || val === null) return "";
      return val;
    });
  });
  
  sheet.getRange(2, 1, rows.length, headerOrder.length).setValues(rows);
}
