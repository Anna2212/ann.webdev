/**
 * Netlify-функція події submission-created.
 * Запускається автоматично щоразу, коли Netlify Forms прийняв заявку.
 *
 * Що робить:
 *   1. Надсилає повідомлення в Telegram
 *   2. Передає дані в Google Таблицю через веб-застосунок Apps Script
 *
 * Токен бота й адреса застосунку читаються зі змінних середовища Netlify.
 * У код сторінки вони не потрапляють ніколи.
 *
 * Змінні, які треба завести в Netlify:
 *   TELEGRAM_BOT_TOKEN  — токен від BotFather
 *   TELEGRAM_CHAT_ID    — id чату, куди слати
 *   SHEETS_WEBHOOK_URL  — адреса веб-застосунку Apps Script (не обов'язково)
 *
 * Якщо змінних немає, функція просто нічого не робить і не падає:
 * заявка все одно лежить у Netlify, у розділі Forms.
 */

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export default async (request) => {
  let payload = {};

  try {
    const body = await request.json();
    payload = body?.payload ?? {};
  } catch {
    return new Response('Не вдалося прочитати заявку', { status: 400 });
  }

  const fields = payload.data ?? {};

  const imya = fields.imya ?? '';
  const kontakt = fields.kontakt ?? '';
  const sayt = fields.sayt ?? '';
  const zadacha = fields.zadacha ?? '';
  const storinka = fields.storinka ?? '';
  const dzherelo = fields.dzherelo ?? '';
  const createdAt = payload.created_at ?? new Date().toISOString();

  const results = [];

  // --- Telegram -------------------------------------------------------
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const lines = [
      '<b>Нова заявка з сайту</b>',
      '',
      `<b>Ім'я:</b> ${escapeHtml(imya)}`,
      `<b>Контакт:</b> ${escapeHtml(kontakt)}`,
      sayt ? `<b>Сайт:</b> ${escapeHtml(sayt)}` : null,
      '',
      `<b>Задача:</b>`,
      escapeHtml(zadacha),
      '',
      `<i>Сторінка: ${escapeHtml(storinka)}</i>`,
      `<i>Джерело: ${escapeHtml(dzherelo)}</i>`,
    ].filter(Boolean);

    try {
      const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join('\n'),
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });
      results.push(`telegram:${tg.status}`);
    } catch (error) {
      results.push(`telegram:error:${error}`);
    }
  } else {
    results.push('telegram:skipped');
  }

  // --- Google Таблиця -------------------------------------------------
  const sheetsUrl = process.env.SHEETS_WEBHOOK_URL;

  if (sheetsUrl) {
    try {
      const sheet = await fetch(sheetsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: createdAt,
          imya,
          kontakt,
          sayt,
          zadacha,
          storinka,
          dzherelo,
        }),
      });
      results.push(`sheets:${sheet.status}`);
    } catch (error) {
      results.push(`sheets:error:${error}`);
    }
  } else {
    results.push('sheets:skipped');
  }

  // Завжди 200: заявка вже збережена в Netlify, і повторні спроби
  // доставки нічого не дадуть
  return new Response(results.join(' | '), { status: 200 });
};
