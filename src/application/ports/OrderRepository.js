export class OrderRepository {
  load() {
    throw new Error("OrderRepository.load() должен быть реализован адаптером");
  }

  save(_order) {
    throw new Error("OrderRepository.save() должен быть реализован адаптером");
  }

  clear() {
    throw new Error("OrderRepository.clear() должен быть реализован адаптером");
  }
}
