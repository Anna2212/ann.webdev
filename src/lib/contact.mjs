/**
 * Перевірка поля «Куди відповісти». Один код і для браузера (Form.astro),
 * і для серверної функції (submission-created.mjs), щоб правила не розходились.
 *
 * Повертає { ok: true, value } з приведеним значенням
 * або { ok: false, error, reason }: error — текст для людини у формі,
 * reason — причина для позначки в заявці.
 */
const ERROR_LENGTH = {
  ok: false,
  error: 'Схоже, в номері зайві цифри. Перевірте, будь ласка',
  reason: 'неправильна кількість цифр у номері',
};
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
    return phone.length === 13 ? { ok: true, value: phone } : ERROR_LENGTH;
  }

  if (phone.startsWith('0')) {
    return phone.length === 10
      ? { ok: true, value: `+38${phone}` }
      : ERROR_LENGTH;
  }

  const digits = phone.replace('+', '').length;
  const lengthOk = digits >= 10 && digits <= 15;
  if (!lengthOk) return ERROR_LENGTH;

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
