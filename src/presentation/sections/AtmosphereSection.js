import { icons } from '../components/icons.js';

export function AtmosphereSection() {
  return `
    <section class="atmosphere section" id="atmosphere" aria-labelledby="atmosphere-title">
      <div class="atmosphere__content reveal">
        <h2 id="atmosphere-title">Место, где город становится тише</h2>
        <p>Тёплый свет, натуральные материалы и продуманные детали. Здесь легко замедлиться, поработать в тишине или встретиться с близкими.</p>
        <button class="text-action" type="button" data-open-reservation>Забронировать стол ${icons.arrow()}</button>
      </div>
      <figure class="atmosphere__main reveal reveal--delay">
        <img src="./assets/images/interior.png" alt="Светлый зал кофейни с деревянной стойкой" width="1600" height="900" loading="lazy" />
      </figure>
      <figure class="atmosphere__detail reveal">
        <img src="./assets/images/hero-coffee.png" alt="Керамика и детали на деревянном столе" width="900" height="1200" loading="lazy" />
      </figure>
    </section>`;
}
