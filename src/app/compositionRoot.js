import { AddItemToOrder } from '../application/use-cases/AddItemToOrder.js';
import { ChangeOrderQuantity } from '../application/use-cases/ChangeOrderQuantity.js';
import { GetMenu } from '../application/use-cases/GetMenu.js';
import { GetOrder } from '../application/use-cases/GetOrder.js';
import { SubmitPreorder } from '../application/use-cases/SubmitPreorder.js';
import { InMemoryCatalogRepository } from '../infrastructure/catalog/InMemoryCatalogRepository.js';
import { LocalStorageOrderRepository } from '../infrastructure/order/LocalStorageOrderRepository.js';
import { CafeController } from '../presentation/controllers/CafeController.js';
import { HomePage } from '../presentation/views/HomePage.js';

export function createApplication(root) {
  const catalogRepository = new InMemoryCatalogRepository();
  const orderRepository = new LocalStorageOrderRepository();

  const page = new HomePage(root);
  page.render();

  return new CafeController({
    root,
    getMenu: new GetMenu(catalogRepository),
    getOrder: new GetOrder(orderRepository),
    addItemToOrder: new AddItemToOrder({ catalogRepository, orderRepository }),
    changeOrderQuantity: new ChangeOrderQuantity(orderRepository),
    submitPreorder: new SubmitPreorder({ orderRepository }),
  });
}
