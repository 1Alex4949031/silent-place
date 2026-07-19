import { icons } from './icons.js';

export function SiteHeader() {
  return `
    <header class="site-header" data-site-header>
      <a class="wordmark" href="#home" aria-label="Тихий Шум — на главную">ТИХИЙ ШУМ</a>
      <nav class="desktop-nav" aria-label="Основная навигация">
        <a href="#menu">Меню</a>
        <a href="#story">О нас</a>
        <a href="#atmosphere">Атмосфера</a>
        <a href="#visit">Контакты</a>
      </nav>
      <div class="header-actions">
        <button class="cart-trigger" type="button" data-open-order aria-label="Открыть предзаказ, товаров: 0">
          ${icons.cart()}
          <span data-cart-count aria-hidden="true">0</span>
        </button>
        <span class="header-divider" aria-hidden="true"></span>
        <button class="button button--accent header-order" type="button" data-open-order>Заказать</button>
        <button class="mobile-menu-trigger" type="button" data-mobile-menu aria-expanded="false" aria-controls="mobile-navigation" aria-label="Открыть меню">
          <span data-menu-icon>${icons.menu()}</span>
        </button>
      </div>
      <nav class="mobile-nav" id="mobile-navigation" data-mobile-navigation aria-label="Мобильная навигация" hidden>
        <a href="#menu">Меню</a>
        <a href="#story">О нас</a>
        <a href="#atmosphere">Атмосфера</a>
        <a href="#visit">Контакты</a>
        <button class="button button--accent" type="button" data-open-order>Заказать</button>
      </nav>
    </header>`;
}
