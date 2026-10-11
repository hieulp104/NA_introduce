/**
 * NA Web Agency: nhận yêu cầu từ form liên hệ trên website.
 *
 * Mỗi yêu cầu sẽ:
 *   1. Gửi email về NOTIFY_EMAILS (Gmail của team và của Hiếu).
 *   2. Ghi thêm một dòng vào Google Sheet chứa script này (nếu có).
 *
 * Cách cài: xem apps-script/HUONG-DAN.md
 */

const NOTIFY_EMAILS = ['nawebagency37@gmail.com', 'hieulp3a2004@gmail.com'];
const TIMEZONE = 'Asia/Ho_Chi_Minh';
const SHEET_NAME = 'Yêu cầu';

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Ô "website" bị ẩn với người thật; bot điền vào thì bỏ qua trong im lặng.
  if (p.website) return json({ ok: true });

  const lead = {
    name: clean(p.name, 100),
    phone: clean(p.phone, 30),
    service: clean(p.service, 100),
    budget: clean(p.budget, 50),
    note: clean(p.note, 2000),
    page: clean(p.page, 300)
  };

  if (!lead.name || !/^[0-9+().\s-]{9,20}$/.test(lead.phone)) {
    return json({ ok: false, error: 'invalid' });
  }

  // Chặn gửi trùng: cùng một số điện thoại trong 60 giây chỉ nhận một lần.
  const cache = CacheService.getScriptCache();
  const key = 'lead:' + lead.phone.replace(/\D/g, '');
  if (cache.get(key)) return json({ ok: true, duplicate: true });
  cache.put(key, '1', 60);

  const time = Utilities.formatDate(new Date(), TIMEZONE, 'dd/MM/yyyy HH:mm');

  logToSheet(time, lead);
  sendMail(time, lead);

  return json({ ok: true });
}

// Chạy hàm này trong trình soạn Apps Script để thử gửi một email mẫu.
function guiThu() {
  const time = Utilities.formatDate(new Date(), TIMEZONE, 'dd/MM/yyyy HH:mm');
  const lead = {
    name: 'Khách thử',
    phone: '0912 345 678',
    service: 'Phần mềm quản lý',
    budget: '5 – 15 triệu',
    note: 'Đây là email thử từ hàm guiThu().',
    page: 'thử nghiệm'
  };
  logToSheet(time, lead);
  sendMail(time, lead);
}

// Mở đường link Web App trên trình duyệt để kiểm tra script đã chạy.
function doGet() {
  return json({ ok: true, service: 'NA Web contact form' });
}

function sendMail(time, lead) {
  const digits = lead.phone.replace(/[^\d+]/g, '');
  const subject = 'Khách mới: ' + lead.name + ' · ' + lead.service;
  const rows = [
    ['Thời gian', time],
    ['Tên', lead.name],
    ['Điện thoại / Zalo', lead.phone],
    ['Cần làm', lead.service],
    ['Ngân sách', lead.budget],
    ['Mô tả', lead.note || '(không có)']
  ];

  const body = rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n') +
    '\n\nGọi lại: tel:' + digits + '\nZalo: https://zalo.me/' + digits.replace(/^\+84/, '0');

  const htmlBody =
    '<div style="font-family:Arial,sans-serif;font-size:15px;color:#2b2721">' +
    '<p style="font-size:18px;margin:0 0 12px"><b>Có khách mới để lại yêu cầu trên website</b></p>' +
    '<table cellpadding="6" style="border-collapse:collapse">' +
    rows.map(function (r) {
      return '<tr><td style="color:#8a7f6a;vertical-align:top">' + esc(r[0]) +
        '</td><td style="white-space:pre-wrap">' + esc(r[1]) + '</td></tr>';
    }).join('') +
    '</table>' +
    '<p style="margin-top:16px">' +
    '<a href="tel:' + esc(digits) + '" style="background:#c3a47b;color:#2a2219;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Gọi ' + esc(lead.phone) + '</a> ' +
    '&nbsp;<a href="https://zalo.me/' + esc(digits.replace(/^\+84/, '0')) + '">Nhắn Zalo</a>' +
    '</p></div>';

  MailApp.sendEmail({
    to: NOTIFY_EMAILS.join(','),
    subject: subject,
    body: body,
    htmlBody: htmlBody,
    name: 'Website NA Web'
  });
}

function logToSheet(time, lead) {
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    if (!book) return;
    const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Thời gian', 'Tên', 'Điện thoại / Zalo', 'Cần làm', 'Ngân sách', 'Mô tả', 'Trang', 'Đã liên hệ']);
      sheet.setFrozenRows(1);
    }
    // Thêm dấu ' để Sheet không cắt số 0 đầu của số điện thoại.
    sheet.appendRow([time, lead.name, "'" + lead.phone, lead.service, lead.budget, lead.note, lead.page, false]);
    sheet.getRange(sheet.getLastRow(), 8).insertCheckboxes();
  } catch (err) {
    // Không có Sheet thì vẫn gửi email bình thường.
    console.warn('Không ghi được vào Sheet: ' + err);
  }
}

function clean(value, max) {
  return String(value || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
