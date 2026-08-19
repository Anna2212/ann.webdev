/**
 * Єдине джерело правди для контактів, меню й повторюваних текстів.
 * Змінюєш тут — міняється на всьому сайті.
 */

/**
 * ТИМЧАСОВО: сайт закритий від пошукових систем, поки живе на технічному
 * домені Netlify. Коли підключиш annwebdev.com — постав true і прибери
 * блок [[headers]] з X-Robots-Tag у netlify.toml.
 */
export const ALLOW_INDEXING = false;

export const SITE = {
  url: 'https://annwebdev.com',
  name: 'Анна Медвідь',
  role: 'веброзробниця',
  tagline: 'Роблю сайти, які приводять заявки',
  city: 'Тернопіль',
  legal: 'ФОП Медвідь Анна Михайлівна',
  lang: 'uk',
} as const;

export const CONTACTS = {
  telegram: { label: '@anna_medvid', href: 'https://t.me/anna_medvid' },
  channel: {
    label: 'Telegram-канал',
    href: 'https://t.me/medvidanna_webdesign',
  },
  instagram: {
    label: '@ann.webdev',
    href: 'https://instagram.com/ann.webdev',
  },
  email: { label: 'medvidanja94@gmail.com', href: 'mailto:medvidanja94@gmail.com' },
  phone: { label: '+380 68 593 54 56', href: 'tel:+380685935456' },
} as const;

export const NAV = [
  { label: 'Послуги', href: '/poslugy' },
  { label: 'Кейси', href: '/keysy' },
  { label: 'Про мене', href: '/pro-mene' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Контакти', href: '/kontakty' },
] as const;

/**
 * Ідентифікатор ресурсу GA4, вигляду G-XXXXXXXXXX.
 * Поки порожній — аналітика не підключається взагалі й банер згоди не
 * показується. Встав свій ID, і все вмикається саме собою.
 */
export const GA_ID = 'G-XG3C5ZG3BM';

/**
 * Посилання на Telegram-бота, який віддає чекліст.
 * Поки порожнє — блок з лід-магнітом не рендериться взагалі.
 * Формат: https://t.me/назва_бота
 */
export const BOT_URL = '';

/** Текст головної дії — однаковий скрізь, крім шапки */
export const CTA = {
  primary: 'Розібрати мій сайт безкоштовно',
  short: 'Безкоштовний розбір',
  anchor: '#zayavka',
} as const;
