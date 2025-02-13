function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = e.parameter;

  if (data.sheet === 'planday') {
    return ContentService.createTextOutput(JSON.stringify(handlePlanDayEntry(data)))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (data.sheet === 'planday') {
    return ContentService.createTextOutput(JSON.stringify(handlePlanDayEntry(data)))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (data.isEdit === 'true') {
    // Update the last row instead of adding a new one
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 2, 1, 7).setValues([[
      data.date,
      data['start-time'],
      data['end-time'],
      data.todo,
      data.done,
      data.forfeit,
      data.freedom
    ]]);
  } else {
    // Add new row as before
    sheet.appendRow([
      new Date(),
      data.date,
      data['start-time'],
      data['end-time'],
      data.todo,
      data.done,
      data.forfeit,
      data.freedom
    ]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success'
  })).setMimeType(ContentService.MimeType.JSON);
}

function getLastEntry() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'empty'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const lastEntry = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Format the date and time values
  const formattedDate = Utilities.formatDate(new Date(lastEntry[1]), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const formattedStartTime = lastEntry[2].toString().padStart(5, '0');
  const formattedEndTime = lastEntry[3].toString().padStart(5, '0');

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    data: {
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      todo: lastEntry[4],
      done: lastEntry[5],
      forfeit: lastEntry[6],
      freedom: lastEntry[7]
    }
  })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getAll') {
    return getAllEntries();
  }
  
  // Your existing doGet logic for getting last entry
  return getLastEntry();
}

function getAllEntries() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'empty'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Get all data except header row
  const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
  
  // Format the data
  const formattedData = data.map(row => ({
    date: Utilities.formatDate(new Date(row[1]), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    startTime: row[2].toString().padStart(5, '0'),
    endTime: row[3].toString().padStart(5, '0'),
    todo: row[4],
    done: row[5],
    forfeit: row[6],
    freedom: row[7]
  }));

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    data: formattedData
  })).setMimeType(ContentService.MimeType.JSON);
}

function handlePlanDayEntry(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('PlanDay');
  
  sheet.appendRow([
    data.date,
    data.startTime,
    data.endTime,
    data.plan,
    data.project
  ]);
  
  return {
    status: 'success',
    message: 'Plan day entry added successfully'
  };
}
