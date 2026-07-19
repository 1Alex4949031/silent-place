const svg = (body, className = 'icon') => `
  <svg class="${className}" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    ${body}
  </svg>`;

export const icons = {
  arrow: () => svg('<path d="M5 12h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  cart: () => svg('<path d="M3 4h2l1.9 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6.1M9.5 20a.7.7 0 1 0 0-1.4.7.7 0 0 0 0 1.4Zm8 0a.7.7 0 1 0 0-1.4.7.7 0 0 0 0 1.4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  menu: () => svg('<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
  close: () => svg('<path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
  plus: () => svg('<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
  minus: () => svg('<path d="M5 12h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
  pin: () => svg('<path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/>'),
  clock: () => svg('<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  check: () => svg('<path d="m5 12 4.5 4.5L19 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
};
