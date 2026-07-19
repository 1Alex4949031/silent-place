import { OrderDrawer } from '../components/OrderDrawer.js';
import { ReservationDialog } from '../components/ReservationDialog.js';
import { SiteFooter } from '../components/SiteFooter.js';
import { SiteHeader } from '../components/SiteHeader.js';
import { AtmosphereSection } from '../sections/AtmosphereSection.js';
import { HeroSection } from '../sections/HeroSection.js';
import { MenuSection } from '../sections/MenuSection.js';
import { StorySection } from '../sections/StorySection.js';
import { VisitSection } from '../sections/VisitSection.js';

export class HomePage {
  constructor(root) {
    this.root = root;
  }

  render() {
    this.root.innerHTML = `
      ${SiteHeader()}
      <main id="content">
        ${HeroSection()}
        ${MenuSection()}
        ${StorySection()}
        ${AtmosphereSection()}
        ${VisitSection()}
      </main>
      ${SiteFooter()}
      ${OrderDrawer()}
      ${ReservationDialog()}
      <div class="toast" role="status" aria-live="polite" data-toast hidden></div>`;
  }
}
