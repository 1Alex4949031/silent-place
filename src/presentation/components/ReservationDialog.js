import { icons } from './icons.js';

export function ReservationDialog() {
  return `
    <dialog class="reservation-dialog" data-reservation-dialog aria-labelledby="reservation-title">
      <button class="dialog-close icon-button" type="button" data-close-reservation aria-label="Закрыть">${icons.close()}</button>
      <div data-reservation-form-view>
        <p class="drawer-index">Бронирование</p>
        <h2 id="reservation-title">Стол для тихой паузы</h2>
        <p class="dialog-intro">Оставьте детали — подтвердим бронь звонком в течение 15 минут.</p>
        <form class="reservation-form" data-reservation-form>
          <div class="form-row">
            <label class="field">
              <span>Дата</span>
              <input name="date" type="date" required />
            </label>
            <label class="field">
              <span>Время</span>
              <select name="time" required>
                <option>10:00</option><option>12:00</option><option>14:00</option>
                <option>16:00</option><option>18:00</option><option>20:00</option>
              </select>
            </label>
          </div>
          <div class="form-row">
            <label class="field">
              <span>Гостей</span>
              <select name="guests" required>
                <option value="1">1 гость</option><option value="2" selected>2 гостя</option>
                <option value="3">3 гостя</option><option value="4">4 гостя</option>
                <option value="5">5 гостей</option><option value="6">6 гостей</option>
              </select>
            </label>
            <label class="field">
              <span>Ваше имя</span>
              <input name="name" autocomplete="name" required />
            </label>
          </div>
          <label class="field">
            <span>Телефон</span>
            <input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+7 900 000-00-00" />
          </label>
          <button class="button button--accent button--wide" type="submit">Забронировать стол</button>
        </form>
      </div>
      <div class="reservation-success" data-reservation-success hidden>
        <span class="success-mark">${icons.check()}</span>
        <h2>Стол почти ваш.</h2>
        <p>Мы позвоним, чтобы подтвердить время и количество гостей.</p>
        <button class="button button--dark" type="button" data-close-reservation>Хорошо</button>
      </div>
    </dialog>`;
}
