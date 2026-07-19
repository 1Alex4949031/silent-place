import { createApplication } from './compositionRoot.js';

const root = document.querySelector('#app');

try {
  const application = createApplication(root);
  application.init();
} catch (error) {
  console.error(error);
  root.innerHTML = `
    <main class="fatal-error">
      <p>Не удалось открыть сайт.</p>
      <button type="button" onclick="location.reload()">Попробовать ещё раз</button>
    </main>`;
}
