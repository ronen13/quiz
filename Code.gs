// ─── הגדרות ───────────────────────────────────────────────
var TO_EMAIL   = "ronench@inno-tech.io";
var SHEET_NAME = "תשובות";

// ─── עמודות ───────────────────────────────────────────────
var COLUMNS = [
  "תאריך ושעה","שם מלא","שם החברה / המיזם","שנת הקמה",
  "אתר / עמוד רשת","ארץ פעילות","תיאור המיזם","תחום עיקרי",
  "פירוט תחום אחר","שלב המיזם","מטרות מימון","פירוט מטרה אחרת",
  "סדר גודל מימון","אזורי עניין","פירוט אזור אחר",
  "שיתופי פעולה בינלאומיים","בקשות קודמות","דדליינים קרובים","הערות נוספות"
];

// ─── GET handler ──────────────────────────────────────────
function doGet(e) {
  try {
    var data = JSON.parse(decodeURIComponent(e.parameter.data));
    saveToSheet(data);
    sendEmail(data);
  } catch(err) {
    // שגיאה — ממשיכים בכל מקרה
  }

  // מחזירים דף HTML ריק שסוגר את עצמו
  return HtmlService.createHtmlOutput(
    '<script>window.close();</script><p>תודה!</p>'
  );
}

// ─── שמירה בגיליון ────────────────────────────────────────
function saveToSheet(d) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.getRange(1, 1, 1, COLUMNS.length)
      .setBackground("#0A5C42")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  var now = Utilities.formatDate(new Date(), "Asia/Jerusalem", "dd/MM/yyyy HH:mm");

  sheet.appendRow([
    now,
    d.name || "", d.company || "", d.year || "", d.website || "",
    d.country || "", d.description || "",
    arrToStr(d.sector), d.sector_other || "", d.stage || "",
    arrToStr(d.goal), d.goal_other || "", d.funding || "",
    arrToStr(d.region), d.region_other || "", d.intl || "",
    d.past_grants || "", d.deadline || "", d.notes || ""
  ]);
}

// ─── שליחת מייל ───────────────────────────────────────────
function sendEmail(d) {
  var subject = "שאלון מענקים חדש - " + (d.company || d.name || "מיזם חדש");

  var rows = [
    ["שם מלא", d.name], ["שם החברה / המיזם", d.company],
    ["שנת הקמה", d.year], ["אתר / עמוד רשת", d.website],
    ["ארץ פעילות", d.country], ["תיאור המיזם", d.description],
    ["תחום עיקרי", arrToStr(d.sector)], ["פירוט תחום", d.sector_other],
    ["שלב המיזם", d.stage], ["מטרות מימון", arrToStr(d.goal)],
    ["פירוט מטרה", d.goal_other], ["סדר גודל מימון", d.funding],
    ["אזורי עניין", arrToStr(d.region)], ["פירוט אזור", d.region_other],
    ["שיתוף פעולה בינלאומי", d.intl], ["בקשות קודמות", d.past_grants],
    ["דדליינים קרובים", d.deadline], ["הערות נוספות", d.notes]
  ];

  var tableRows = rows
    .filter(function(r) { return r[1] && String(r[1]).trim(); })
    .map(function(r) {
      return '<tr>' +
        '<td style="padding:9px 14px;background:#f0faf6;font-weight:600;color:#0F6E56;width:35%;border-bottom:1px solid #e0f0ea;font-family:Arial,sans-serif;font-size:14px;text-align:right;">' + r[0] + '</td>' +
        '<td style="padding:9px 14px;color:#1a1a1a;border-bottom:1px solid #e0f0ea;font-family:Arial,sans-serif;font-size:14px;text-align:right;">' + String(r[1]).replace(/\n/g,"<br>") + '</td>' +
        '</tr>';
    }).join("");

  var submittedAt = Utilities.formatDate(new Date(), "Asia/Jerusalem", "dd/MM/yyyy HH:mm");

  var html =
    '<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="UTF-8"></head>' +
    '<body style="margin:0;padding:0;background:#f4f7f4;font-family:Arial,sans-serif;direction:rtl;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 20px;"><tr><td>' +
    '<table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;">' +
    '<tr><td style="background:linear-gradient(135deg,#1D9E75,#0F6E56);padding:28px 32px;text-align:right;">' +
    '<p style="margin:0;font-size:11px;color:rgba(255,255,255,0.7);">Inno-Tech Grants</p>' +
    '<h1 style="margin:6px 0 0;font-size:22px;color:#fff;">שאלון התאמה חדש התקבל</h1>' +
    '</td></tr>' +
    '<tr><td style="padding:20px 32px 8px;"><p style="margin:0;font-size:15px;color:#333;">הטופס הוגש ב-<strong>' + submittedAt + '</strong></p></td></tr>' +
    '<tr><td style="padding:12px 32px 24px;"><table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0f0ea;border-radius:8px;overflow:hidden;">' +
    tableRows + '</table></td></tr>' +
    '<tr><td style="background:#f0faf6;padding:14px 32px;text-align:center;border-top:1px solid #e0f0ea;">' +
    '<p style="margin:0;font-size:12px;color:#888;">נשלח דרך מערכת שאלון המענקים של Inno-Tech</p>' +
    '</td></tr></table></td></tr></table></body></html>';

  GmailApp.sendEmail(TO_EMAIL, subject, "", { htmlBody: html });
}

// ─── עזר ──────────────────────────────────────────────────
function arrToStr(val) {
  if (!val) return "";
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}
