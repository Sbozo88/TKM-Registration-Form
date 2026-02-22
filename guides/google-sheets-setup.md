# Google Sheets Setup Guide

Follow these steps to create the backend for your data backup.

## Step 1: Create the Spreadsheet
1. Go to [Google Sheets](https://sheets.new) and create a new sheet.
2. Name it **"TKM Registration Data"**.
3. Rename the first tab (at the bottom) to **"Students"**.
4. Create a second tab and name it **"Teachers"**.

## Step 2: Add the Script
1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any code in the editor and paste the code below:

```javascript
const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const sheetName = e.parameter.type === 'teacher' ? 'Teachers' : 'Students';
    const doc = SpreadsheetApp.openById(SHEET_ID);
    const sheet = doc.getSheetByName(sheetName);

    // Get headers or create them if empty
    const headersRange = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1);
    let headers;
    if (headersRange.getWidth() > 1) {
        headers = headersRange.getValues()[0];
    } else {
        // Fallback or dynamic headers (basic implementation assumes headers exist)
        // For robustness, run the setup function first!
        return ContentService
          .createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'Headers not found. Run setup() first.' }))
          .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Append data
    const nextRow = sheet.getLastRow() + 1;
    const newRow = headers.map(function(header) {
      if (header === 'timestamp') return new Date();
      return e.parameter[header] || ''; // Handle missing fields
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function setup() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  
  // Setup Students Sheet
  let sheet = doc.getSheetByName('Students');
  if (!sheet) {
    sheet = doc.insertSheet('Students');
  } else {
    sheet.clear(); // CAUTION: Clears existing sheet for setup if you run it
  }
  const studentHeaders = ['timestamp', 'parentName', 'studentName', 'email', 'phone', 'instrument', 'experience', 'idNumber', 'school', 'grade', 'address'];
  sheet.getRange(1, 1, 1, studentHeaders.length).setValues([studentHeaders]);
  
  // Setup Teachers Sheet
  sheet = doc.getSheetByName('Teachers');
  if (!sheet) {
    sheet = doc.insertSheet('Teachers');
  } else {
    sheet.clear(); // CAUTION: Clears existing sheet for setup if you run it
  }
  const teacherHeaders = ['timestamp', 'fullName', 'email', 'phone', 'instruments', 'qualifications', 'experience', 'bio'];
  sheet.getRange(1, 1, 1, teacherHeaders.length).setValues([teacherHeaders]);
}
```

3. Click the **Save** icon (floppy disk).
4. Run the `setup` function **ONCE**:
   - Select `setup` from the dropdown menu in the toolbar.
   - Click **Run**.
   - Review permissions (Click "Review permissions", choose your account, click "Advanced" > "Go to [Project Name] (unsafe)", then "Allow").

## Step 3: Deploy as Web App
1. Click the blue **Deploy** button > **New deployment**.
2. Click the **Select type** gear icon > **Web app**.
3. **Description**: "Registration Form Backend".
4. **Execute as**: "Me".
5. **Who has access**: **"Anyone"** (This is important for the form to work request-free).
6. Click **Deploy**.
7. **Copy the "Web App URL"** (it ends with `/exec`).

## Step 4: Share the URL
Paste the **Web App URL** in the chat so I can connect it to your app!

## Troubleshooting

### Error: "TypeError: \"\" is not a function"

This usually happens if the script is not linked to the spreadsheet correctly.

**Fix:**
1. Ensure you opened the script via **Extensions > Apps Script** inside your Google Sheet.
2. Ensure you copied the code exactly without any extra characters at the top.
3. Run the `setup()` function in the editor. If it fails, the script is likely disjointed.
4. If disjointed, copy the code, close the tab, go back to Sheets > Extensions > Apps Script, and paste again.

### Alternative Fix: Hardcode Sheet ID

If the script still crashes, replace the first line with your specific Sheet ID.

1. Copy the ID from your spreadsheet URL:
   `docs.google.com/spreadsheets/d/THIS_LONG_STRING_IS_THE_ID/edit`

2. Update the code to use this ID directly:

```javascript
// REPLACE with your actual Sheet ID
const SHEET_ID = '1aBcDeFgHiJkLmNoPqRsTuVwXyZ_1234567890'; 

function doPost(e) {
  // ... rest of the code remains the same ...
  // ...
}
```
