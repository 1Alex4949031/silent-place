import { icons } from './icons.js';

export function OrderDrawer() {
  return `
    <div class="drawer-layer" data-order-layer hidden>
      <button class="drawer-backdrop" type="button" data-close-order aria-label="Закрыть предзаказ"></button>
      <aside class="order-drawer" role="dialog" aria-modal="true" aria-labelledby="order-title" tabindex="-1" data-order-drawer>
        <div class="drawer-header">
          <div>
            <p class="drawer-index">Предзаказ</p>
            <h2 id="order-title">Ваш заказ</h2>
          </div>
          <button class="icon-button" type="button" data-close-order aria-label="Закрыть">${icons.close()}</button>
        </div>

        <div class="order-success" data-order-success hidden tabindex="-1">
          <span class="success-mark">${icons.check()}</span>
          <h3>Готовим.</h3>
          <p data-order-success-message></p>
          <button class="button button--dark" type="button" data-close-order>Вернуться на сайт</button>
        </div>

        <div data-order-flow>
          <div class="order-empty" data-order-empty>
            <p>Корзина пока пуста.</p>
            <span>Выберите кофе, завтрак или выпечку — добавим всё к одному времени.</span>
            <button class="text-action" type="button" data-close-and-menu>Перейти в меню ${icons.arrow()}</button>
          </div>

          <div class="order-lines" data-order-lines aria-live="polite"></div>

          <form class="preorder-form" data-preorder-form novalidate hidden>
            <div class="order-total">
              <span>Итого</span>
              <strong data-order-total>0 ₽</strong>
            </div>
            <div class="form-grid">
              <label class="field">
                <span>Когда заберёте</span>
                <select name="pickupTime" required>
                  <option value="Через 15 минут">Через 15 минут</option>
                  <option value="Через 30 минут">Через 30 минут</option>
                  <option value="Через 45 минут">Через 45 минут</option>
                  <option value="Через 1 час">Через 1 час</option>
                </select>
              </label>
              <label class="field">
                <span>Ваше имя</span>
                <input name="name" autocomplete="name" minlength="2" required placeholder="Как к вам обращаться" />
              </label>
              <label class="field">
                <span>Телефон</span>
                <input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+7 900 000-00-00" />
              </label>
            </div>
            <p class="form-error" data-order-error role="alert" hidden></p>
            <button class="button button--accent button--wide" type="submit">Подтвердить предзаказ</button>
            <p class="form-note">Оплата при получении. Заказ храним 20 минут.</p>
          </form>
        </div>
      </aside>
    </div>`;
}
