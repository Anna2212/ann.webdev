/**
 * Перевірка поля «Куди відповісти». Один код і для браузера (Form.astro),
 * і для серверної функції (submission-created.mjs), щоб правила не розходились.
 *
 * Повертає { ok: true, value } з приведеним значенням
 * або { ok: false, error, reason }: error — текст для людини у формі,
 * reason — причина для позначки в заявці.
 */
const ERROR_LONG = {
  ok: false,
  error: 'Схоже, в номері зайві цифри. Перевірте, будь ласка',
  reason: 'забагато цифр у номері',
};
const ERROR_SHORT = {
  ok: false,
  error: 'Схоже, в номері не вистачає цифр. Перевірте, будь ласка',
  reason: 'замало цифр у номері',
};
const byLength = (length, expected) =>
  length < expected ? ERROR_SHORT : ERROR_LONG;
const ERROR_FORMAT = {
  ok: false,
  error: 'Напишіть номер, @нік або пошту',
  reason: 'не схоже на номер, @нік або пошту',
};

const checkPhone = (raw) => {
  const cleaned = raw.replace(/[\s()\-‐-―]/g, '');
  if (!/^\+?\d+$/.test(cleaned)) return ERROR_FORMAT;

  // Український номер часто пишуть без плюса: 380XXXXXXXXX
  const phone = cleaned.startsWith('380') ? `+${cleaned}` : cleaned;

  if (phone.startsWith('+380')) {
    return phone.length === 13 ? { ok: true, value: phone } : byLength(phone.length, 13);
  }

  if (phone.startsWith('0')) {
    return phone.length === 10
      ? { ok: true, value: `+38${phone}` }
      : byLength(phone.length, 10);
  }

  const digits = phone.replace('+', '').length;
  if (digits < 10) return ERROR_SHORT;
  if (digits > 15) return ERROR_LONG;

  // Міжнародний номер обов'язково з плюсом
  return phone.startsWith('+') ? { ok: true, value: phone } : ERROR_FORMAT;
};

export const checkContact = (input) => {
  const value = String(input ?? '').trim();

  if (value.startsWith('@')) {
    return /^@[A-Za-z0-9._]{3,32}$/.test(value)
      ? { ok: true, value }
      : ERROR_FORMAT;
  }

  // Пошта може починатись і з цифри, тому @ перевіряємо раніше за телефон
  if (value.includes('@')) {
    return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/.test(value)
      ? { ok: true, value }
      : ERROR_FORMAT;
  }

  // Номер може починатись з дужки: (067) 123-45-67
  if (/^[+(]?\s*\d/.test(value)) return checkPhone(value);

  return ERROR_FORMAT;
};

/*
 * Далі — тільки для браузера: підказки під час введення.
 */

const NICK = /^[A-Za-z0-9._]{3,32}$/;

/**
 * Нік без собачки доповнює: annwebdev → @annwebdev.
 * Решту повертає як є.
 */
export const completeContact = (input) => {
  const value = String(input ?? '').trim();
  return NICK.test(value) && !/^\d+$/.test(value) ? `@${value}` : value;
};

/**
 * Оформлює український номер під час введення: 067… → +380 67 567 76 78.
 * cap — не давати ввести більше 9 цифр після коду (для набору з клавіатури;
 * при вставці не обрізаємо, щоб не «полагодити» номер мовчки).
 * Міжнародний номер з іншим кодом, нік і пошту не чіпає.
 */
export const formatPhoneInput = (raw, { cap = true } = {}) => {
  const value = String(raw ?? '').trimStart();
  if (!/^[+(\d]/.test(value)) return raw;

  const plus = value.startsWith('+');
  const digits = value.replace(/\D/g, '');
  if (!digits) return value;

  // Код ще набирається: +3, +38, 38 — поки незрозуміло, чий це номер
  if ('380'.startsWith(digits) && digits !== '380') return value;

  let local;
  if (digits.startsWith('380')) local = digits.slice(3);
  else if (plus) return value;
  else if (digits.startsWith('0')) local = digits.slice(1);
  else local = digits;

  if (cap) local = local.slice(0, 9);

  const parts = [
    local.slice(0, 2),
    local.slice(2, 5),
    local.slice(5, 7),
    local.slice(7, 9),
    local.slice(9),
  ].filter(Boolean);

  return ['+380', ...parts].join(' ');
};
