import { OrderRepository } from "../../application/ports/OrderRepository.js";
import { Order } from "../../domain/order/Order.js";

const getDefaultStorage = () => {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
};

const hasStorageContract = (storage) =>
  storage &&
  typeof storage.getItem === "function" &&
  typeof storage.setItem === "function" &&
  typeof storage.removeItem === "function";

export class LocalStorageOrderRepository extends OrderRepository {
  #storage;
  #key;
  #memorySnapshot = null;

  constructor({ storage = getDefaultStorage(), key = "tihiy-shum.order.v1" } = {}) {
    super();

    if (typeof key !== "string" || key.trim() === "") {
      throw new TypeError("Ключ хранилища должен быть непустой строкой");
    }

    this.#storage = hasStorageContract(storage) ? storage : null;
    this.#key = key.trim();
  }

  get persistenceAvailable() {
    return this.#storage !== null;
  }

  load() {
    if (this.#storage) {
      let serialized;

      try {
        serialized = this.#storage.getItem(this.#key);
      } catch {
        this.#storage = null;
        return this.#loadFromMemory();
      }

      if (serialized === null) {
        return null;
      }

      try {
        const restored = Order.fromSnapshot(JSON.parse(serialized));
        this.#memorySnapshot = restored.toSnapshot();
        return restored;
      } catch {
        try {
          this.#storage.removeItem(this.#key);
        } catch {
          this.#storage = null;
        }

        return this.#loadFromMemory();
      }
    }

    return this.#loadFromMemory();
  }

  save(order) {
    if (!order || typeof order.toSnapshot !== "function") {
      throw new TypeError("OrderRepository.save() ожидает сущность Order");
    }

    const validatedOrder = Order.fromSnapshot(order.toSnapshot());
    this.#memorySnapshot = validatedOrder.toSnapshot();

    if (this.#storage) {
      try {
        this.#storage.setItem(this.#key, JSON.stringify(this.#memorySnapshot));
      } catch {
        this.#storage = null;
      }
    }

    return this.#memorySnapshot;
  }

  clear() {
    this.#memorySnapshot = null;

    if (this.#storage) {
      try {
        this.#storage.removeItem(this.#key);
      } catch {
        this.#storage = null;
      }
    }
  }

  #loadFromMemory() {
    return this.#memorySnapshot ? Order.fromSnapshot(this.#memorySnapshot) : null;
  }
}
