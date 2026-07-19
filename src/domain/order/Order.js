const MAX_ITEM_QUANTITY = 99;
const PRODUCT_FIELDS = [
  "id",
  "category",
  "categoryLabel",
  "name",
  "description",
  "volume",
  "badge",
  "price",
];

const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const freeze = (value) => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }

  return value;
};

const assertNonEmptyString = (value, field) => {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${field} должен быть непустой строкой`);
  }

  return value.trim();
};

const normalizeQuantity = (quantity, { allowZero = false } = {}) => {
  const minimum = allowZero ? 0 : 1;

  if (!Number.isInteger(quantity) || quantity < minimum || quantity > MAX_ITEM_QUANTITY) {
    throw new RangeError(
      `Количество должно быть целым числом от ${minimum} до ${MAX_ITEM_QUANTITY}`,
    );
  }

  return quantity;
};

const normalizeProduct = (product) => {
  if (!product || typeof product !== "object") {
    throw new TypeError("Позиция меню должна быть объектом");
  }

  const normalized = Object.create(null);

  for (const field of PRODUCT_FIELDS) {
    if (product[field] !== undefined) {
      normalized[field] = product[field];
    }
  }

  normalized.id = assertNonEmptyString(normalized.id, "id позиции");
  normalized.name = assertNonEmptyString(normalized.name, "Название позиции");

  if (!Number.isFinite(normalized.price) || normalized.price < 0) {
    throw new RangeError("Цена позиции должна быть неотрицательным числом");
  }

  normalized.price = roundMoney(normalized.price);

  for (const field of ["category", "categoryLabel", "description", "volume", "badge"]) {
    if (normalized[field] !== undefined && typeof normalized[field] !== "string") {
      throw new TypeError(`${field} должен быть строкой`);
    }
  }

  return freeze({ ...normalized });
};

export class OrderItemNotFoundError extends Error {
  constructor(itemId) {
    super(`Позиция «${itemId}» отсутствует в заказе`);
    this.name = "OrderItemNotFoundError";
    this.code = "ORDER_ITEM_NOT_FOUND";
  }
}

export class Order {
  #items = new Map();

  constructor(snapshot = undefined) {
    if (snapshot === undefined || snapshot === null) {
      return;
    }

    if (!snapshot || typeof snapshot !== "object" || !Array.isArray(snapshot.items)) {
      throw new TypeError("Некорректный снимок заказа");
    }

    for (const line of snapshot.items) {
      const quantity = normalizeQuantity(line?.quantity);
      const product = normalizeProduct(line);

      if (this.#items.has(product.id)) {
        throw new TypeError(`Позиция «${product.id}» встречается в снимке дважды`);
      }

      this.#items.set(product.id, { product, quantity });
    }
  }

  static fromSnapshot(snapshot) {
    return new Order(snapshot);
  }

  get isEmpty() {
    return this.#items.size === 0;
  }

  get totalItems() {
    return [...this.#items.values()].reduce((sum, line) => sum + line.quantity, 0);
  }

  get subtotal() {
    return roundMoney(
      [...this.#items.values()].reduce(
        (sum, line) => sum + line.product.price * line.quantity,
        0,
      ),
    );
  }

  get total() {
    return this.subtotal;
  }

  addItem(product, quantity = 1) {
    const normalizedProduct = normalizeProduct(product);
    const increment = normalizeQuantity(quantity);
    const current = this.#items.get(normalizedProduct.id);
    const nextQuantity = (current?.quantity ?? 0) + increment;

    normalizeQuantity(nextQuantity);
    this.#items.set(normalizedProduct.id, {
      product: current?.product ?? normalizedProduct,
      quantity: nextQuantity,
    });

    return this.toSnapshot();
  }

  decrementItem(itemId, quantity = 1) {
    const id = assertNonEmptyString(itemId, "id позиции");
    const decrement = normalizeQuantity(quantity);
    const current = this.#items.get(id);

    if (!current) {
      return this.toSnapshot();
    }

    const nextQuantity = current.quantity - decrement;

    if (nextQuantity <= 0) {
      this.#items.delete(id);
    } else {
      this.#items.set(id, { ...current, quantity: nextQuantity });
    }

    return this.toSnapshot();
  }

  setQuantity(itemId, quantity) {
    const id = assertNonEmptyString(itemId, "id позиции");
    const nextQuantity = normalizeQuantity(quantity, { allowZero: true });

    if (nextQuantity === 0) {
      return this.removeItem(id);
    }

    const current = this.#items.get(id);

    if (!current) {
      throw new OrderItemNotFoundError(id);
    }

    this.#items.set(id, { ...current, quantity: nextQuantity });
    return this.toSnapshot();
  }

  removeItem(itemId) {
    const id = assertNonEmptyString(itemId, "id позиции");
    this.#items.delete(id);
    return this.toSnapshot();
  }

  clear() {
    this.#items.clear();
    return this.toSnapshot();
  }

  toSnapshot() {
    const items = [...this.#items.values()].map(({ product, quantity }) =>
      freeze({
        ...product,
        quantity,
        lineTotal: roundMoney(product.price * quantity),
      }),
    );

    const totalItems = items.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = roundMoney(items.reduce((sum, line) => sum + line.lineTotal, 0));

    return freeze({
      items,
      totalItems,
      subtotal,
      total: subtotal,
    });
  }
}
