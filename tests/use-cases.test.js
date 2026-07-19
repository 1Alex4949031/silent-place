import test from "node:test";
import assert from "node:assert/strict";

import { GetMenu } from "../src/application/use-cases/GetMenu.js";
import { GetOrder } from "../src/application/use-cases/GetOrder.js";
import {
  AddItemToOrder,
  MenuItemNotFoundError,
} from "../src/application/use-cases/AddItemToOrder.js";
import { ChangeOrderQuantity } from "../src/application/use-cases/ChangeOrderQuantity.js";
import {
  EmptyOrderError,
  SubmitPreorder,
} from "../src/application/use-cases/SubmitPreorder.js";
import { InMemoryCatalogRepository } from "../src/infrastructure/catalog/InMemoryCatalogRepository.js";
import { LocalStorageOrderRepository } from "../src/infrastructure/order/LocalStorageOrderRepository.js";

const catalogRepository = new InMemoryCatalogRepository([
  { id: "flat-white", name: "Флэт уайт", category: "coffee", price: 290 },
]);

const createOrderRepository = () => new LocalStorageOrderRepository({ storage: null });

test("GetMenu получает каталог через порт", () => {
  const menu = new GetMenu(catalogRepository).execute();

  assert.equal(menu.length, 1);
  assert.equal(menu[0].id, "flat-white");
  assert.ok(Object.isFrozen(menu));
});

test("AddItemToOrder создаёт заказ и GetOrder читает его снимок", () => {
  const orderRepository = createOrderRepository();
  const addItem = new AddItemToOrder({ catalogRepository, orderRepository });

  const afterAdd = addItem.execute("flat-white", 2);
  const persisted = new GetOrder(orderRepository).execute();

  assert.equal(afterAdd.totalItems, 2);
  assert.deepEqual(persisted, afterAdd);
});

test("AddItemToOrder отклоняет неизвестную позицию", () => {
  const orderRepository = createOrderRepository();
  const addItem = new AddItemToOrder({ catalogRepository, orderRepository });

  assert.throws(() => addItem.execute("missing"), MenuItemNotFoundError);
});

test("ChangeOrderQuantity меняет количество и удаляет позицию при нуле", () => {
  const orderRepository = createOrderRepository();
  const addItem = new AddItemToOrder({ catalogRepository, orderRepository });
  const changeQuantity = new ChangeOrderQuantity(orderRepository);

  addItem.execute("flat-white");
  assert.equal(changeQuantity.execute("flat-white", 3).totalItems, 3);
  assert.equal(changeQuantity.execute({ itemId: "flat-white", quantity: 0 }).totalItems, 0);
});

test("SubmitPreorder возвращает неизменяемое подтверждение и очищает корзину", () => {
  const orderRepository = createOrderRepository();
  const addItem = new AddItemToOrder({ catalogRepository, orderRepository });
  addItem.execute("flat-white", 2);

  const submit = new SubmitPreorder({
    orderRepository,
    clock: () => new Date("2026-07-16T04:00:00.000Z"),
    idGenerator: () => "preorder-42",
  });
  const confirmation = submit.execute({
    name: "Анна",
    phone: "+7 999 123-45-67",
    pickupTime: "Через 20 минут",
    comment: "Без крышки",
  });

  assert.equal(confirmation.id, "preorder-42");
  assert.equal(confirmation.status, "received");
  assert.equal(confirmation.order.total, 580);
  assert.ok(Object.isFrozen(confirmation));
  assert.ok(Object.isFrozen(confirmation.customer));
  assert.equal(new GetOrder(orderRepository).execute().totalItems, 0);
});

test("SubmitPreorder не оформляет пустой заказ и проверяет данные гостя", () => {
  const emptyRepository = createOrderRepository();
  const submitEmpty = new SubmitPreorder({ orderRepository: emptyRepository });
  assert.throws(
    () => submitEmpty.execute({ name: "Анна", phone: "+7 999 123-45-67" }),
    EmptyOrderError,
  );

  const orderRepository = createOrderRepository();
  new AddItemToOrder({ catalogRepository, orderRepository }).execute("flat-white");
  const submit = new SubmitPreorder({ orderRepository });

  assert.throws(() => submit.execute({ name: "Анна", phone: "123" }), TypeError);
  assert.equal(new GetOrder(orderRepository).execute().totalItems, 1);
});
