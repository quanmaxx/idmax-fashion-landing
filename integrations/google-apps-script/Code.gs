/*
 * IDMAX - GOOGLE SHEETS LEAD ENDPOINT
 *
 * Cach dung:
 * 1. Tao mot Google Sheet moi, tao tab Leads.
 * 2. Mo Extensions > Apps Script.
 * 3. Dan toan bo file nay vao Code.gs.
 * 4. Sua 3 gia tri trong CONFIG.
 * 5. Chay ham setupSheet mot lan de tao hang tieu de.
 * 6. Deploy > New deployment > Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 7. Copy URL ket thuc bang /exec vao:
 *    assets/js/marketing-config.js
 */

var CONFIG = {
    SPREADSHEET_ID: "PASTE_GOOGLE_SHEET_ID_HERE",
    SHEET_NAME: "Leads",
    NOTIFY_EMAIL: "PASTE_NOTIFICATION_EMAIL_HERE",
    TIMEZONE: "Asia/Ho_Chi_Minh",
    BRAND_NAME: "IDMAX"
};

var HEADERS = [
    "Thời gian",
    "Họ và tên",
    "Số điện thoại / Zalo",
    "Tên thương hiệu",
    "Giai đoạn thương hiệu",
    "Tình trạng logo",
    "Tình trạng bảo hộ",
    "Nhu cầu / vấn đề",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "UTM Content",
    "UTM Term",
    "FBCLID",
    "GCLID",
    "Landing page",
    "Referrer",
    "User agent",
    "Trạng thái chăm sóc"
];

function setupSheet() {
    var spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME) ||
        spreadsheet.insertSheet(CONFIG.SHEET_NAME);

    if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, HEADERS.length)
            .setFontWeight("bold")
            .setBackground("#E2C392");
        sheet.autoResizeColumns(1, HEADERS.length);
    }
}

function doGet() {
    return ContentService
        .createTextOutput("IDMAX lead endpoint is running.")
        .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
        var params = e && e.parameter ? e.parameter : {};

        // Bo qua bot dien vao truong an.
        if (clean(params.website, 100)) {
            return response("ignored");
        }

        var fullName = clean(params.full_name, 150);
        var phone = clean(params.phone, 50);

        if (!fullName || !phone) {
            return response("missing_required_fields");
        }

        var spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
        var sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME) ||
            spreadsheet.insertSheet(CONFIG.SHEET_NAME);

        if (sheet.getLastRow() === 0) {
            setupSheet();
        }

        var row = [
            new Date(),
            safeCell(fullName),
            safeCell(phone),
            safeCell(params.brand_name),
            safeCell(params.brand_stage),
            safeCell(params.logo_status),
            safeCell(params.protection_status),
            safeCell(params.needs, 2000),
            safeCell(params.utm_source),
            safeCell(params.utm_medium),
            safeCell(params.utm_campaign),
            safeCell(params.utm_content),
            safeCell(params.utm_term),
            safeCell(params.fbclid),
            safeCell(params.gclid),
            safeCell(params.landing_page, 1000),
            safeCell(params.referrer, 1000),
            safeCell(params.user_agent, 1000),
            "Mới"
        ];

        sheet.appendRow(row);
        sendNotification(row);

        return response("ok");
    } catch (error) {
        console.error(error);
        return response("error");
    } finally {
        lock.releaseLock();
    }
}

function sendNotification(row) {
    var time = Utilities.formatDate(
        row[0],
        CONFIG.TIMEZONE,
        "dd/MM/yyyy HH:mm"
    );

    var subject = "Lead mới từ landing page IDMAX - " + row[1];
    var body = [
        "Có khách hàng mới đăng ký tư vấn logo thời trang.",
        "",
        "Thời gian: " + time,
        "Họ và tên: " + row[1],
        "Số điện thoại / Zalo: " + row[2],
        "Tên thương hiệu: " + row[3],
        "Giai đoạn: " + row[4],
        "Tình trạng logo: " + row[5],
        "Tình trạng bảo hộ: " + row[6],
        "Nhu cầu / vấn đề: " + row[7],
        "",
        "Nguồn quảng cáo:",
        "UTM Source: " + row[8],
        "UTM Medium: " + row[9],
        "UTM Campaign: " + row[10],
        "UTM Content: " + row[11],
        "FBCLID: " + row[13],
        "",
        "Mở Google Sheet để cập nhật trạng thái chăm sóc."
    ].join("\n");

    MailApp.sendEmail({
        to: CONFIG.NOTIFY_EMAIL,
        subject: subject,
        body: body,
        name: CONFIG.BRAND_NAME
    });
}

function clean(value, maxLength) {
    return String(value || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength || 500);
}

function safeCell(value, maxLength) {
    var text = clean(value, maxLength || 500);

    if (/^[=+\-@]/.test(text)) {
        return "'" + text;
    }

    return text;
}

function response(message) {
    return ContentService
        .createTextOutput(message)
        .setMimeType(ContentService.MimeType.TEXT);
}
