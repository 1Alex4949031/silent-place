import { icons } from '../components/icons.js';

const rubles = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const menuImages = {
  'flat-white': './assets/images/menu/flat-white.png',
  'espresso-tonic': './assets/images/menu/espresso-tonic.png',
  cappuccino: './assets/images/menu/cappuccino.png',
  'filter-coffee': './assets/images/menu/filter-coffee.png',
  'syrniki-salted-caramel': './assets/images/menu/syrniki-salted-caramel.webp',
  'salmon-brioche': './assets/images/menu/salmon-brioche.webp',
  shakshuka: './assets/images/menu/shakshuka.webp',
  'granola-berries': './assets/images/menu/granola-berries.webp',
  'almond-croissant': './assets/images/menu/almond-croissant.webp',
  'pain-au-chocolat': './assets/images/menu/pain-au-chocolat.webp',
  'cinnamon-bun': './assets/images/menu/cinnamon-bun.webp',
  'basque-cheesecake': './assets/images/menu/basque-cheesecake.webp',
};

export function presentMenu(items) {
  if (!items.length) {
    return '<p class="menu-empty">Этот раздел обновляется. Загляните чуть позже.</p>';
  }

  return items.map((item, index) => {
    const image = menuImages[item.id];
    return `
    <article class="menu-item${image ? ' menu-item--image' : ''}">
      ${image
        ? `<figure class="menu-item__thumb"><img src="${image}" alt="" width="144" height="144" loading="lazy" /></figure>`
        : `<span class="menu-item__index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>`}
      <div class="menu-item__body">
        <div class="menu-item__title-row">
          <h3>${escapeHtml(item.name)}</h3>
          ${item.badge ? `<span class="menu-item__badge">${escapeHtml(item.badge)}</span>` : ''}
        </div>
        <p>${escapeHtml(item.description)}</p>
        ${item.volume ? `<span class="menu-item__volume">${escapeHtml(item.volume)}</span>` : ''}
      </div>
      <strong class="menu-item__price">${rubles.format(item.price)}</strong>
      <button class="menu-item__add" type="button" data-add-item="${escapeHtml(item.id)}" aria-label="Добавить ${escapeHtml(item.name)} в заказ">
        ${icons.plus()}
      </button>
    </article>`;
  }).join('');
}

export { rubles };
