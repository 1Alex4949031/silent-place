import { icons } from '../components/icons.js';

export function HeroSection() {
  return `
    <section class="hero" id="home" aria-labelledby="hero-title">
      <div class="hero__content reveal">
        <h1 id="hero-title">Кофе, ради которого хочется задержаться.</h1>
        <p>Обжариваем зерно сами, готовим понятную еду и оставляем место для тишины.</p>
        <div class="hero__actions">
          <a class="button button--accent" href="#menu">Смотреть меню</a>
          <button class="text-action" type="button" data-open-reservation>
            Забронировать стол ${icons.arrow()}
          </button>
        </div>
      </div>
      <figure class="hero__media reveal reveal--delay">
        <img src="./assets/images/hero-coffee.png" alt="Чашка кофе на деревянной стойке кофейни" width="1200" height="900" fetchpriority="high" />
      </figure>
    </section>`;
}
