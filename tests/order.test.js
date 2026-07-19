import test from "node:test";
import assert from "node:assert/strict";

import { Order, OrderItemNotFoundError } from "../src/domain/order/Order.js";

const flatWhite = Object.freeze({
  id: "flat-white",
  category: "coffee",
  name: "Флэт уайт",
  description: "Двойной эспрессо и молоко",
  price: 290,
});

test("Order добавляет позиции, считает количество и сумму", () => {
  const order = new Order();

  order.addItem(flatWhite);
  const snapshot = order.addItem(flatWhite, 2);

  assert.equal(snapshot.items.length, 1);
  assert.equal(snapshot.items[0].quantity, 3);
  assert.equal(snapshot.items[0].lineTotal, 870);
  assert.equal(snapshot.totalItems, 3);
  assert.equal(snapshot.subtotal, 870);
  assert.equal(snapshot.total, 870);
});

test("Order уменьшает количество и удаляет позицию при достижении нуля", () => {
  const order = new Order();
  order.addItem(flatWhite, 2);

  assert.equal(order.decrementItem(flatWhite.id).items[0].quantity, 1);
  assert.equal(order.decrementItem(flatWhite.id).items.length, 0);
  assert.equal(order.totalItems, 0);
});

test("Order изменяет абсолютное количество и явно удаляет позиции", () => {
  const order = new Order();
  order.addItem(flatWhite);

  assert.equal(order.setQuantity(flatWhite.id, 4).totalItems, 4);
  assert.equal(order.removeItem(flatWhite.id).totalItems, 0);
  assert.throws(() => order.setQuantity("missing", 1), OrderItemNotFoundError);
});

test("Order возвращает новый глубоко неизменяемый снимок", () => {
  const order = new Order();
  const first = order.addItem(flatWhite);

  assert.ok(Object.isFrozen(first));
  assert.ok(Object.isFrozen(first.items));
  assert.ok(Object.isFrozen(first.items[0]));
  assert.throws(() => {
    first.items[0].quantity = 99;
  }, TypeError);

  order.addItem(flatWhite);
  assert.equal(first.items[0].quantity, 1);
  assert.equal(order.toSnapshot().items[0].quantity, 2);
});

test("Order восстанавливается из снимка без общей изменяемой ссылки", () => {
  const original = new Order();
  original.addItem(flatWhite, 2);

  const restored = Order.fromSnapshot(original.toSnapshot());
  restored.decrementItem(flatWhite.id);

  assert.equal(original.totalItems, 2);
  assert.equal(restored.totalItems, 1);
});

test("Order отклоняет некорректные товары и количества", () => {
  const order = new Order();

  assert.throws(() => order.addItem({ id: "bad", name: "Bad", price: -1 }), RangeError);
  assert.throws(() => order.addItem(flatWhite, 0), RangeError);
  assert.throws(() => order.addItem(flatWhite, 100), RangeError);
});
