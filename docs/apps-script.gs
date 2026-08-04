/**
 * Google Apps Script — приймає заявки з сайту і додає рядок у таблицю.
 *
 * Як підключити:
 *
 *  1. Створи нову Google Таблицю, назви як хочеш
 *  2. У ній: Розширення → Apps Script
 *  3. Видали все, що там є, і встав цей код
 *  4. Збережи (значок дискети)
 *  5. Натисни «Розгорнути» → «Новий розгорнутий проєкт»
 *  6. Тип — «Веб-застосунок»
 *  7. Виконувати від імені — «Я»
 *  8. Хто має доступ — «Усі» (саме так, інакше Netlify не достукається)
 *  9. Розгорнути, дати дозволи
 * 10. Скопіюй адресу веб-застосунку — вона виду
 *     https://script.google.com/macros/s/.../exec
 * 11. Встав її в Netlify: Project configuration → Environment variables →
 *     змінна SHEETS_WEBHOOK_URL
 *
 * Заголовки в таблиці створяться самі при першій заявці.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);

    // Перший запуск — створюємо шапку
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Дата',
        'Ім’я',
        'Контакт',
        'Сайт',
        'Задача',
        'Сторінка',
        'Джерело',
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      payload.data || new Date(),
      payload.imya || '',
      payload.kontakt || '',
      payload.sayt || '',
      payload.zadacha || '',
      payload.storinka || '',
      payload.dzherelo || '',
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(error) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
