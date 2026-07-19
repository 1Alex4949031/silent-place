import { Order } from "../../domain/order/Order.js";

const assertOrderRepository = (repository) => {
  if (!repository || typeof repository.load !== "function") {
    throw new TypeError("GetOrder требует OrderRepository");
  }
};

export class GetOrder {
  constructor(orderRepository) {
    assertOrderRepository(orderRepository);
    this.orderRepository = orderRepository;
  }

  execute() {
    const order = this.orderRepository.load() ?? new Order();
    return order.toSnapshot();
  }
}
