import { icons } from '../components/icons.js';

export function MenuSection() {
  return `
    <section class="menu-section section" id="menu" aria-labelledby="menu-title">
      <div class="section-heading reveal">
        <h2 id="menu-title">Выберите свой ритм</h2>
      </div>
      <div class="menu-tabs reveal" role="tablist" aria-label="Разделы меню">
        <button type="button" role="tab" aria-selected="true" data-category="coffee">Кофе</button>
        <button type="button" role="tab" aria-selected="false" data-category="breakfast">Завтраки</button>
        <button type="button" role="tab" aria-selected="false" data-category="bakery">Выпечка</button>
      </div>
      <div class="menu-list" data-menu-list aria-live="polite"></div>
      <button class="text-action menu-more" type="button" data-open-order>
        Смотреть заказ ${icons.arrow()}
      </button>
    </section>`;
}
