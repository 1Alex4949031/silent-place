import test from "node:test";
import assert from "node:assert/strict";

import { Order } from "../src/domain/order/Order.js";
import { InMemoryCatalogRepository } from "../src/infrastructure/catalog/InMemoryCatalogRepository.js";
import { LocalStorageOrderRepository } from "../src/infrastructure/order/LocalStorageOrderRepository.js";

class FakeStorage {
  values = new Map();

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, value);
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

const product = { id: "filter", name: "Фильтр", price: 230 };

test("InMemoryCatalogRepository отдаёт неизменяемый каталог и ищет по id", () => {
  const repository = new InMemoryCatalogRepository([product]);
  const catalog = repository.getAll();

  assert.ok(Object.isFrozen(catalog));
  assert.ok(Object.isFrozen(catalog[0]));
  assert.equal(repository.getById("filter")?.name, "Фильтр");
  assert.equal(repository.getById("missing"), null);
});

test("каталог содержит по четыре товара для каждой вкладки", () => {
  const catalog = new InMemoryCatalogRepository().getAll();
  const count = (category) => catalog.filter((item) => item.category === category).length;

  assert.equal(count("coffee"), 4);
  assert.equal(count("breakfast"), 4);
  assert.equal(count("bakery"), 4);
  assert.equal(catalog.find((item) => item.id === "flat-white")?.price, 290);
  assert.equal(catalog.find((item) => item.id === "syrniki-salted-caramel")?.price, 490);
});

test("LocalStorageOrderRepository сохраняет, восстанавливает и очищает заказ", () => {
  const storage = new FakeStorage();
  const repository = new LocalStorageOrderRepository({ storage, key: "test-order" });
  const order = new Order();
  order.addItem(product, 2);

  repository.save(order);
  const restored = repository.load();

  assert.notEqual(restored, order);
  assert.deepEqual(restored.toSnapshot(), order.toSnapshot());

  restored.addItem(product);
  assert.equal(order.totalItems, 2);

  repository.clear();
  assert.equal(repository.load(), null);
});

test("LocalStorageOrderRepository использует память, если storage недоступен", () => {
  const brokenStorage = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
    removeItem() {
      throw new Error("blocked");
    },
  };
  const repository = new LocalStorageOrderRepository({ storage: brokenStorage });
  const order = new Order();
  order.addItem(product);

  repository.save(order);

  assert.equal(repository.persistenceAvailable, false);
  assert.deepEqual(repository.load().toSnapshot(), order.toSnapshot());
});

test("LocalStorageOrderRepository безопасно удаляет повреждённый снимок", () => {
  const storage = new FakeStorage();
  storage.setItem("order", "{not-json");
  const repository = new LocalStorageOrderRepository({ storage, key: "order" });

  assert.equal(repository.load(), null);
  assert.equal(storage.getItem("order"), null);
});
