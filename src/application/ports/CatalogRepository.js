export class CatalogRepository {
  getAll() {
    throw new Error("CatalogRepository.getAll() должен быть реализован адаптером");
  }

  getById(_itemId) {
    throw new Error("CatalogRepository.getById() должен быть реализован адаптером");
  }
}
