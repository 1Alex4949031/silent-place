import { icons } from '../components/icons.js';

export function VisitSection() {
  return `
    <section class="visit" id="visit" aria-labelledby="visit-title">
      <div class="visit__content reveal">
        <h2 id="visit-title">Зайдите сегодня</h2>
        <p>${icons.pin()}<span>Красный проспект, 22</span></p>
        <p>${icons.clock()}<span>Пн–Пт 08:00–22:00 · Сб–Вс 09:00–23:00</span></p>
        <a class="button button--accent" href="https://yandex.ru/maps/?text=%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B9%20%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%2C%2022" target="_blank" rel="noreferrer">
          Построить маршрут ${icons.arrow()}
        </a>
      </div>
      <div
        class="visit__map"
        role="img"
        aria-label="Схема расположения кофейни Тихий Шум: Красный проспект, 22, рядом с улицей Коммунистической"
      >
        <svg viewBox="0 0 820 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          <rect class="map-surface" width="820" height="420" />
          <g class="map-blocks">
            <path d="M34 24H203V103H34zM229 24H418V102H229zM506 24H660V103H506zM686 24H796V103H686z" />
            <path d="M34 139H204V218H34zM229 139H416V218H229zM506 139H661V218H506zM686 139H796V218H686z" />
            <path d="M34 266H203V353H34zM229 266H416V353H229zM506 266H661V353H506zM686 266H796V353H686z" />
          </g>
          <g class="map-roads">
            <path class="map-road map-road--minor" d="M0 120H820M0 371H820M216 0V420M674 0V420" />
            <path class="map-road map-road--avenue" d="M456 -30C448 92 449 194 458 248S475 357 470 450" />
            <path class="map-road map-road--street" d="M-30 239C159 235 291 241 458 248S665 253 850 236" />
            <path class="map-road map-road--center" d="M456 -30C448 92 449 194 458 248S475 357 470 450M-30 239C159 235 291 241 458 248S665 253 850 236" />
          </g>
          <g class="map-labels">
            <text class="map-label map-label--avenue" x="488" y="74" transform="rotate(85 488 74)">Красный проспект</text>
            <text class="map-label map-label--street" x="190" y="226">ул. Коммунистическая</text>
            <text class="map-label map-label--minor" x="72" y="360">ул. Свердлова</text>
          </g>
          <g class="map-marker" transform="translate(459 248)">
            <circle r="30" class="map-point-halo" />
            <circle r="14" class="map-point-ring" />
            <circle r="6" class="map-point" />
          </g>
          <g class="map-compass" transform="translate(760 55)">
            <path d="M0 18 8 0l8 18-8-5Z" />
            <text x="8" y="-8" text-anchor="middle">С</text>
          </g>
        </svg>
        <div class="map-place-card" aria-hidden="true">
          <span>Вы здесь</span>
          <strong>Тихий Шум</strong>
          <small>Красный проспект, 22</small>
        </div>
        <span class="map-coordinates" aria-hidden="true">55.02312° N · 82.92285° E</span>
      </div>
    </section>`;
}
