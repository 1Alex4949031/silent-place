import { CatalogRepository } from "../../application/ports/CatalogRepository.js";
import { menuItems } from "../../shared/config/menu.js";

const freezeItem = (source) => {
  if (!source || typeof source !== "object") {
    throw new TypeError("Позиция каталога должна быть объектом");
  }

  if (typeof source.id !== "string" || source.id.trim() === "") {
    throw new TypeError("У позиции каталога должен быть id");
  }

  return Object.freeze({ ...source, id: source.id.trim() });
};

export class InMemoryCatalogRepository extends CatalogRepository {
  #items;
  #itemsById;

  constructor(items = menuItems) {
    super();

    if (!Array.isArray(items)) {
      throw new TypeError("Каталог должен быть массивом");
    }

    this.#items = Object.freeze(items.map(freezeItem));
    this.#itemsById = new Map();

    for (const catalogItem of this.#items) {
      if (this.#itemsById.has(catalogItem.id)) {
        throw new TypeError(`id позиции каталога должен быть уникальным: ${catalogItem.id}`);
      }

      this.#itemsById.set(catalogItem.id, catalogItem);
    }
  }

  getAll() {
    return this.#items;
  }

  getById(itemId) {
    if (typeof itemId !== "string") {
      return null;
    }

    return this.#itemsById.get(itemId.trim()) ?? null;
  }
}
