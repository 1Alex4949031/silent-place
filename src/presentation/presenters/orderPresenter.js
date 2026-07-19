import { icons } from '../components/icons.js';
import { rubles } from './menuPresenter.js';

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export function presentOrderLines(items) {
  return items.map((item) => `
    <article class="order-line">
      <div class="order-line__copy">
        <h3>${escapeHtml(item.name)}</h3>
        <span>${rubles.format(item.price)} · ${escapeHtml(item.volume || '1 порция')}</span>
      </div>
      <div class="quantity-control" aria-label="Количество ${escapeHtml(item.name)}">
        <button type="button" data-set-quantity="${escapeHtml(item.id)}" data-value="${item.quantity - 1}" aria-label="Уменьшить количество">${icons.minus()}</button>
        <span aria-live="polite">${item.quantity}</span>
        <button type="button" data-set-quantity="${escapeHtml(item.id)}" data-value="${item.quantity + 1}" aria-label="Увеличить количество">${icons.plus()}</button>
      </div>
      <strong>${rubles.format(item.lineTotal)}</strong>
    </article>`).join('');
}
