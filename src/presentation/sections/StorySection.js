import { icons } from '../components/icons.js';

export function StorySection() {
  return `
    <section class="story section" id="story" aria-labelledby="story-title">
      <figure class="story__media reveal">
        <img src="./assets/images/roasting.png" alt="Обжарка кофейного зерна небольшими партиями" width="1200" height="900" loading="lazy" />
      </figure>
      <div class="story__content reveal reveal--delay">
        <h2 id="story-title">Всё начинается<br />с зерна</h2>
        <p>Мы обжариваем небольшими партиями на ростере в нашей кофейне. Выбираем зелёное зерно у проверенных фермеров и строим с ними долгие отношения.</p>
        <p>Прозрачное происхождение, бережная обжарка и внимание к деталям — чтобы в каждой чашке был честный вкус и характер.</p>
        <a class="text-action" href="#atmosphere">Подробнее о нас ${icons.arrow()}</a>
        <svg class="coffee-branch" viewBox="0 0 205 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M91 286C82 216 99 148 134 40M97 223c-34-11-49-33-51-62 30 5 47 23 51 62Zm15-70c-8-33 2-58 29-76 7 30-2 56-29 76Zm7 67c21-27 45-36 73-28-15 27-39 37-73 28ZM128 112c20-25 42-33 67-23-15 24-37 32-67 23Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
          <circle cx="107" cy="177" r="7" fill="none" stroke="currentColor" stroke-width="1.2"/>
          <circle cx="121" cy="165" r="7" fill="none" stroke="currentColor" stroke-width="1.2"/>
          <circle cx="117" cy="183" r="7" fill="none" stroke="currentColor" stroke-width="1.2"/>
        </svg>
      </div>
    </section>`;
}
