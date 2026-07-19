import { Order } from "../../domain/order/Order.js";

export class MenuItemNotFoundError extends Error {
  constructor(itemId) {
    super(`Позиция меню «${itemId}» не найдена`);
    this.name = "MenuItemNotFoundError";
    this.code = "MENU_ITEM_NOT_FOUND";
  }
}

const normalizeCommand = (itemIdOrCommand, quantity) => {
  if (itemIdOrCommand && typeof itemIdOrCommand === "object") {
    return {
      itemId: itemIdOrCommand.itemId,
      quantity: itemIdOrCommand.quantity ?? 1,
    };
  }

  return { itemId: itemIdOrCommand, quantity };
};

export class AddItemToOrder {
  constructor({ catalogRepository, orderRepository } = {}) {
    if (!catalogRepository || typeof catalogRepository.getById !== "function") {
      throw new TypeError("AddItemToOrder требует CatalogRepository");
    }

    if (
      !orderRepository ||
      typeof orderRepository.load !== "function" ||
      typeof orderRepository.save !== "function"
    ) {
      throw new TypeError("AddItemToOrder требует OrderRepository");
    }

    this.catalogRepository = catalogRepository;
    this.orderRepository = orderRepository;
  }

  execute(itemIdOrCommand, quantity = 1) {
    const command = normalizeCommand(itemIdOrCommand, quantity);
    const menuItem = this.catalogRepository.getById(command.itemId);

    if (!menuItem) {
      throw new MenuItemNotFoundError(command.itemId);
    }

    const order = this.orderRepository.load() ?? new Order();
    order.addItem(menuItem, command.quantity);
    this.orderRepository.save(order);

    return order.toSnapshot();
  }
}
