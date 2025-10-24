import { DataFromAPI } from "../../communicate/DataFromAPI";
import { IProduct, OrderNextPayload } from "../../types";
import { API_URL } from "../../utils/constants";
import { getTotalPrice } from "../../utils/utils";
import { Api } from "../base/Api";
import { events } from "../base/Events";
import { Buyer } from "../Models/Buyer";
import { Cart } from "../Models/Cart";
import { Catalog } from "../Models/Catalog";
import { CardView } from "../Views/CardView";
import { CartView } from "../Views/CartView";
import { CatalogView } from "../Views/CatalogView";
import { ContactsFormView } from "../Views/ContactsFormView";
import { HeaderView } from "../Views/HeaderView";
import { ModalView } from "../Views/ModalView";
import { OrderFormView } from "../Views/OrderFormView";
import { SuccessView } from "../Views/SuccessView";

export class PresenterApp {
  private catalog: Catalog;
  private cart: Cart;
  private buyer: Buyer;

  private api: DataFromAPI;

  private headerView: HeaderView;
  private modalView: ModalView;
  private cartView: CartView;
  private cardView: CardView;

  constructor() {
    this.catalog = new Catalog();
    this.cart = new Cart();
    this.buyer = new Buyer();

    this.api = new DataFromAPI(new Api(API_URL));

    this.headerView = new HeaderView(".header__container");
    this.modalView = new ModalView("#modal-container");
    this.cartView = new CartView();
    this.cardView = new CardView();

  }

  init() {
    this.loadCatalog();
    this.initEvents();
  }

  private async loadCatalog() {
    try {
      const catalogView = new CatalogView(".gallery");
      this.catalog.setProducts(Array.from(await this.api.getAllProducts()));
      catalogView.content = this.catalog.getProducts().map((product) => {
        const cardCatalog = this.cardView.getCardCatalog(product);
        return cardCatalog.getElement();
      });
    } catch (err) {
      console.error("Ошибка загрузки каталога:", err);
    }
  }

  private initEvents() {    
    //открытие и отрисовка карточки товара при выборе карточки в каталоге
    events.on<{ id: string }>("card:select", ({ id }) => {
      const product = this.catalog.getProductById(id);
      if (!product) return;

      const cardPreview = this.cardView.getCardPreview();
      cardPreview.setCartChecker((productId) =>
        this.cart.isProductInCart(productId)
      );
      const onCart = this.cart.isProductInCart(product.id);

      cardPreview.onCart = onCart;
      cardPreview.product = product;
      this.modalView.open(cardPreview.getElement());
    });

    //добавление карточки в корзину
    events.on<IProduct>("cart:add", (product) => {
      this.cart.addProduct(product);
      this.updateCart();
      events.emit("card:select", {id: product.id});
      events.emit("cart:changed");
    });

    //удаление карточки из корзины (в модальном окне "карточка товара")
    events.on<{ id: string }>("cart:remove-by-id", ({ id }) => {
      this.cart.deleteProduct(id);
      this.updateCart();
      events.emit("card:select", {id});
      events.emit("cart:changed");
    });

    //Открытие корзины
    events.on("basket:open", () => {
      this.modalView.open(this.cartView.getElement());
    });

    //удаление карточки из корзины (в модальном окне "корзина")
    events.on<{ index: number }>("cart:remove", ({ index }) => {
      const items = this.cart.getProducts();
      items.splice(index, 1);

      this.cart.clearCart();
      items.forEach((item) => this.cart.addProduct(item));

      this.updateCart();
      events.emit("cart:changed");
    });

    //начало оформления заказа
    events.on("cart:order", () => {
      const orderForm = new OrderFormView(this.buyer.getBuyerData());
      this.modalView.open(orderForm.getElement());
    });

    //переход ко второй части оформления заказа
    events.on<OrderNextPayload>("order:next", ({ payment, address }) => {
      this.buyer.setBuyerData({ payment, address });
      const contactsForm = new ContactsFormView();
      this.modalView.open(contactsForm.getElement());
    });

    //конец оформления заказа и отправка данных на сервер
    events.on<{ email: string; phone: string }>(
      "order:confirm",
      async ({ email, phone }) => {
        this.buyer.setBuyerData({ email, phone });

        const order = {
          ...this.buyer.getBuyerData(),
          items: this.cart.getProducts().map((p) => p.id),
          total: this.cart.totalPrice(),
        };

        try {
          const result: { total: number } = await this.api.sendOrder(order);
          const success = new SuccessView();
          success.total = result.total;
          this.modalView.open(success.getElement());

          this.cart.clearCart();
          this.updateCart();
        } catch (err) {
          console.error("Ошибка при заказе:", err);
        }
      }
    );

    //закрытие модального окна после оформления заказа
    events.on("success:close", () => {
      this.modalView.close();
    });
  }

  /**
   * Функция для обновления списка карточек в корзине при добавлении и удалении
   * Обновление счетчика корзины
   */
  updateCart(): void {
    this.cartView.totalPrice = getTotalPrice(this.cart.getProducts());
    this.cartView.content = this.cart.getProducts().map((product, index) => {
      return this.cardView.getCardInCart(product, index).getElement();
    });
    this.headerView.counter = this.cart.getProducts().length;
  }
}
