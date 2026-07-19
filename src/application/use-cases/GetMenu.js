const assertCatalogRepository = (repository) => {
  if (!repository || typeof repository.getAll !== "function") {
    throw new TypeError("GetMenu требует CatalogRepository");
  }
};

export class GetMenu {
  constructor(catalogRepository) {
    assertCatalogRepository(catalogRepository);
    this.catalogRepository = catalogRepository;
  }

  execute() {
    return this.catalogRepository.getAll();
  }
}
