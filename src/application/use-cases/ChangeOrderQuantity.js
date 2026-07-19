import { Order } from "../../domain/order/Order.js";

const normalizeCommand = (itemIdOrCommand, quantity) => {
  if (itemIdOrCommand && typeof itemIdOrCommand === "object") {
    return {
      itemId: itemIdOrCommand.itemId,
      quantity: itemIdOrCommand.quantity,
    };
  }

  return { itemId: itemIdOrCommand, quantity };
};

export class ChangeOrderQuantity {
  constructor(orderRepository) {
    if (
      !orderRepository ||
      typeof orderRepository.load !== "function" ||
      typeof orderRepository.save !== "function"
    ) {
      throw new TypeError("ChangeOrderQuantity требует OrderRepository");
    }

    this.orderRepository = orderRepository;
  }

  execute(itemIdOrCommand, quantity) {
    const command = normalizeCommand(itemIdOrCommand, quantity);
    const order = this.orderRepository.load() ?? new Order();

    order.setQuantity(command.itemId, command.quantity);
    this.orderRepository.save(order);

    return order.toSnapshot();
  }
}
