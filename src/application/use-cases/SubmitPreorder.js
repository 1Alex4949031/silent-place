const deepFreeze = (value) => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }

  return value;
};

const defaultIdGenerator = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `order-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

const requiredText = (value, label, maximumLength) => {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${label} обязательно`);
  }

  const normalized = value.trim();

  if (normalized.length > maximumLength) {
    throw new RangeError(`${label} не должно превышать ${maximumLength} символов`);
  }

  return normalized;
};

const optionalText = (value, label, maximumLength, fallback = "") => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value !== "string") {
    throw new TypeError(`${label} должно быть строкой`);
  }

  const normalized = value.trim();

  if (normalized.length > maximumLength) {
    throw new RangeError(`${label} не должно превышать ${maximumLength} символов`);
  }

  return normalized;
};

const normalizeCustomer = (details) => {
  if (!details || typeof details !== "object") {
    throw new TypeError("Укажите данные гостя");
  }

  const name = requiredText(details.name, "Имя", 80);
  const phone = requiredText(details.phone, "Телефон", 40);
  const phoneDigits = phone.replace(/\D/g, "");

  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    throw new TypeError("Укажите корректный номер телефона");
  }

  return deepFreeze({
    name,
    phone,
    pickupTime: optionalText(
      details.pickupTime,
      "Время получения",
      60,
      "Как можно скорее",
    ),
    comment: optionalText(details.comment, "Комментарий", 300),
  });
};

export class EmptyOrderError extends Error {
  constructor() {
    super("Нельзя оформить пустой заказ");
    this.name = "EmptyOrderError";
    this.code = "EMPTY_ORDER";
  }
}

export class SubmitPreorder {
  constructor({
    orderRepository,
    clock = () => new Date(),
    idGenerator = defaultIdGenerator,
  } = {}) {
    if (
      !orderRepository ||
      typeof orderRepository.load !== "function" ||
      typeof orderRepository.clear !== "function"
    ) {
      throw new TypeError("SubmitPreorder требует OrderRepository");
    }

    if (typeof clock !== "function" || typeof idGenerator !== "function") {
      throw new TypeError("clock и idGenerator должны быть функциями");
    }

    this.orderRepository = orderRepository;
    this.clock = clock;
    this.idGenerator = idGenerator;
  }

  execute(customerDetails) {
    const order = this.orderRepository.load();

    if (!order || order.isEmpty) {
      throw new EmptyOrderError();
    }

    const customer = normalizeCustomer(customerDetails);
    const createdAt = new Date(this.clock());

    if (Number.isNaN(createdAt.getTime())) {
      throw new TypeError("clock вернул некорректную дату");
    }

    const id = String(this.idGenerator()).trim();

    if (!id) {
      throw new TypeError("idGenerator вернул пустой идентификатор");
    }

    const preorder = deepFreeze({
      id,
      status: "received",
      createdAt: createdAt.toISOString(),
      customer,
      order: order.toSnapshot(),
    });

    this.orderRepository.clear();
    return preorder;
  }
}
