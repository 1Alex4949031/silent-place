import { icons } from '../components/icons.js';
import { presentMenu, rubles } from '../presenters/menuPresenter.js';
import { presentOrderLines } from '../presenters/orderPresenter.js';

export class CafeController {
  constructor({ root, getMenu, getOrder, addItemToOrder, changeOrderQuantity, submitPreorder }) {
    this.root = root;
    this.getMenu = getMenu;
    this.getOrder = getOrder;
    this.addItemToOrder = addItemToOrder;
    this.changeOrderQuantity = changeOrderQuantity;
    this.submitPreorder = submitPreorder;
    this.catalog = [];
    this.order = { items: [], totalItems: 0, total: 0 };
    this.toastTimer = null;
    this.lastFocused = null;
  }

  init() {
    this.catalog = this.getMenu.execute();
    this.order = this.getOrder.execute();
    this.cacheElements();
    this.renderMenu('coffee');
    this.renderOrder();
    this.bindEvents();
    this.setupReveal();
    this.setReservationDate();
  }

  cacheElements() {
    this.menuList = this.root.querySelector('[data-menu-list]');
    this.orderLayer = this.root.querySelector('[data-order-layer]');
    this.orderDrawer = this.root.querySelector('[data-order-drawer]');
    this.orderLines = this.root.querySelector('[data-order-lines]');
    this.orderEmpty = this.root.querySelector('[data-order-empty]');
    this.preorderForm = this.root.querySelector('[data-preorder-form]');
    this.orderFlow = this.root.querySelector('[data-order-flow]');
    this.orderSuccess = this.root.querySelector('[data-order-success]');
    this.reservationDialog = this.root.querySelector('[data-reservation-dialog]');
    this.toast = this.root.querySelector('[data-toast]');
  }

  bindEvents() {
    this.root.addEventListener('click', (event) => this.handleClick(event));
    this.preorderForm.addEventListener('submit', (event) => this.handlePreorder(event));
    this.root.querySelector('[data-reservation-form]').addEventListener('submit', (event) => this.handleReservation(event));
    this.orderDrawer.addEventListener('keydown', (event) => this.trapDrawerFocus(event));
    this.reservationDialog.addEventListener('click', (event) => {
      if (event.target === this.reservationDialog) this.closeReservation();
    });
    window.addEventListener('scroll', () => {
      this.root.querySelector('[data-site-header]').classList.toggle('is-scrolled', window.scrollY > 24);
    }, { passive: true });
  }

  handleClick(event) {
    const target = event.target.closest('button, a');
    if (!target) return;

    if (target.matches('[data-add-item]')) this.addItem(target.dataset.addItem);
    if (target.matches('[data-set-quantity]')) this.setQuantity(target.dataset.setQuantity, Number(target.dataset.value));
    if (target.matches('[data-category]')) this.selectCategory(target);
    if (target.matches('[data-open-order]')) this.openOrder();
    if (target.matches('[data-close-order]')) this.closeOrder();
    if (target.matches('[data-close-and-menu]')) {
      this.closeOrder();
      document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
    }
    if (target.matches('[data-open-reservation]')) this.openReservation();
    if (target.matches('[data-close-reservation]')) this.closeReservation();
    if (target.matches('[data-mobile-menu]')) this.toggleMobileMenu(target);
    if (target.closest('[data-mobile-navigation]') && target.tagName === 'A') this.closeMobileMenu();
  }

  renderMenu(category) {
    const items = this.catalog.filter((item) => item.category === category);
    this.menuList.innerHTML = presentMenu(items);
  }

  selectCategory(tab) {
    this.root.querySelectorAll('[data-category]').forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    this.renderMenu(tab.dataset.category);
  }

  addItem(itemId) {
    this.order = this.addItemToOrder.execute(itemId);
    this.renderOrder();
    const item = this.catalog.find((product) => product.id === itemId);
    this.showToast(`${item?.name || 'Позиция'} — в заказе`);
  }

  setQuantity(itemId, quantity) {
    this.order = this.changeOrderQuantity.execute(itemId, quantity);
    this.renderOrder();
  }

  renderOrder() {
    this.root.querySelectorAll('[data-cart-count]').forEach((node) => { node.textContent = this.order.totalItems; });
    this.root.querySelectorAll('[data-open-order]').forEach((node) => {
      const name = node.getAttribute('aria-label');
      if (name?.startsWith('Открыть предзаказ')) node.setAttribute('aria-label', `Открыть предзаказ, товаров: ${this.order.totalItems}`);
    });
    this.orderLines.innerHTML = presentOrderLines(this.order.items);
    this.orderEmpty.hidden = this.order.items.length > 0;
    this.preorderForm.hidden = this.order.items.length === 0;
    this.root.querySelector('[data-order-total]').textContent = rubles.format(this.order.total);
  }

  openOrder() {
    this.lastFocused = document.activeElement;
    this.orderLayer.hidden = false;
    requestAnimationFrame(() => this.orderLayer.classList.add('is-open'));
    document.body.classList.add('is-locked');
    this.orderDrawer.focus();
  }

  closeOrder() {
    this.orderLayer.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    window.setTimeout(() => {
      this.orderLayer.hidden = true;
      if (!this.orderSuccess.hidden) {
        this.orderSuccess.hidden = true;
        this.orderFlow.hidden = false;
        this.preorderForm.reset();
      }
    }, 260);
    this.lastFocused?.focus?.();
  }

  handlePreorder(event) {
    event.preventDefault();
    const error = this.root.querySelector('[data-order-error]');
    error.hidden = true;
    try {
      const details = Object.fromEntries(new FormData(this.preorderForm));
      const receipt = this.submitPreorder.execute(details);
      this.order = this.getOrder.execute();
      this.renderOrder();
      const shortId = receipt.id.replaceAll('-', '').slice(-6).toUpperCase();
      this.root.querySelector('[data-order-success-message]').textContent = `Заказ №${shortId} принят. Приготовим ${receipt.customer.pickupTime.toLowerCase()} на Красном проспекте, 22. Оплата — у стойки.`;
      this.orderFlow.hidden = true;
      this.orderSuccess.hidden = false;
      this.orderSuccess.focus();
    } catch (exception) {
      error.textContent = exception.message || 'Проверьте данные и попробуйте ещё раз.';
      error.hidden = false;
    }
  }

  openReservation() {
    this.root.querySelector('[data-reservation-form-view]').hidden = false;
    this.root.querySelector('[data-reservation-success]').hidden = true;
    this.reservationDialog.showModal();
  }

  closeReservation() {
    if (this.reservationDialog.open) this.reservationDialog.close();
  }

  handleReservation(event) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    this.root.querySelector('[data-reservation-form-view]').hidden = true;
    this.root.querySelector('[data-reservation-success]').hidden = false;
  }

  setReservationDate() {
    const dateInput = this.root.querySelector('[data-reservation-form] input[type="date"]');
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
    dateInput.min = localDate;
    dateInput.value = localDate;
  }

  toggleMobileMenu(button) {
    const nav = this.root.querySelector('[data-mobile-navigation]');
    const willOpen = nav.hidden;
    nav.hidden = !willOpen;
    button.setAttribute('aria-expanded', String(willOpen));
    button.setAttribute('aria-label', willOpen ? 'Закрыть меню' : 'Открыть меню');
    button.querySelector('[data-menu-icon]').innerHTML = willOpen ? icons.close() : icons.menu();
  }

  closeMobileMenu() {
    const trigger = this.root.querySelector('[data-mobile-menu]');
    const nav = this.root.querySelector('[data-mobile-navigation]');
    nav.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'Открыть меню');
    trigger.querySelector('[data-menu-icon]').innerHTML = icons.menu();
  }

  trapDrawerFocus(event) {
    if (event.key === 'Escape') return this.closeOrder();
    if (event.key !== 'Tab') return;
    const focusable = [...this.orderDrawer.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled])')].filter((node) => !node.closest('[hidden]'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  setupReveal() {
    const nodes = document.querySelectorAll('.reveal');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
  }

  showToast(message) {
    window.clearTimeout(this.toastTimer);
    this.toast.textContent = message;
    this.toast.hidden = false;
    requestAnimationFrame(() => this.toast.classList.add('is-visible'));
    this.toastTimer = window.setTimeout(() => {
      this.toast.classList.remove('is-visible');
      window.setTimeout(() => { this.toast.hidden = true; }, 200);
    }, 2200);
  }
}
