/**
 * Перевірка поля «Куди відповісти». Один код і для браузера (Form.astro),
 * і для серверної функції (submission-created.mjs), щоб правила не розходились.
 *
 * Повертає { ok: true, value } з приведеним значенням
 * або { ok: false, error } з текстом для людини.
 */
const ERROR_LENGTH = 'Схоже, в номері зайві цифри. Перевірте, будь ласка';
const ERROR_FORMAT = 'Напишіть номер, @нік або пошту';

const fail = (error) => ({ ok: false, error });

const checkPhone = (raw) => {
  const phone = raw.replace(/[\s()\-‐-―]/g, '');
  if (!/^\+?\d+$/.test(phone)) return fail(ERROR_FORMAT);

  if (phone.startsWith('+380')) {
    return phone.length === 13 ? { ok: true, value: phone } : fail(ERROR_LENGTH);
  }

  if (phone.startsWith('0')) {
    return phone.length === 10
      ? { ok: true, value: `+38${phone}` }
      : fail(ERROR_LENGTH);
  }

  const digits = phone.replace('+', '').length;
  const lengthOk = digits >= 10 && digits <= 15;
  if (!lengthOk) return fail(ERROR_LENGTH);

  // Міжнародний номер обов'язково з плюсом
  return phone.startsWith('+') ? { ok: true, value: phone } : fail(ERROR_FORMAT);
};

export const checkContact = (input) => {
  const value = String(input ?? '').trim();

  if (value.startsWith('@')) {
    return /^@[A-Za-z0-9._]{3,32}$/.test(value)
      ? { ok: true, value }
      : fail(ERROR_FORMAT);
  }

  // Пошта може починатись і з цифри, тому @ перевіряємо раніше за телефон
  if (value.includes('@')) {
    return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/.test(value)
      ? { ok: true, value }
      : fail(ERROR_FORMAT);
  }

  // Номер може починатись з дужки: (067) 123-45-67
  if (/^[+(]?\s*\d/.test(value)) return checkPhone(value);

  return fail(ERROR_FORMAT);
};
