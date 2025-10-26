import { DataFromAPI } from "../../communicate/DataFromAPI";
import { IProduct, TValidateErrors } from "../../types";
import { API_URL } from "../../utils/constants";
import { toCardInCartData } from "../../utils/mappers";
import { getTotalPrice } from "../../utils/utils";
import { Api } from "../base/Api";
import { EventEmitter, events } from "../base/Events";
import { Buyer } from "../Models/Buyer";
import { Cart } from "../Models/Cart";
import { Catalog } from "../Models/Catalog";
import { CardCatalogView } from "../Views/CardCatalogView";
import { CardInCartView } from "../Views/CardInCartView";
import { CardPreviewView } from "../Views/CardPreviewView";
import { CartView } from "../Views/CartView";
import { CatalogView } from "../Views/CatalogView";
import { FormView } from "../Views/FormView";
import { HeaderView } from "../Views/HeaderView";
import { ModalView } from "../Views/ModalView";
import { SuccessView } from "../Views/SuccessView";

export class PresenterApp {
  private events: EventEmitter;

  private catalog: Catalog;
  private cart: Cart;
  private buyer: Buyer;

  private api: DataFromAPI;

  private catalogView: CatalogView;

  private headerView: HeaderView;
  private modalView: ModalView;
  private cartView: CartView;

  private previewCard: CardPreviewView | null = null;

  private formView: FormView;

  constructor() {
    this.events = new EventEmitter();

    this.catalogView = new CatalogView(".gallery");

    this.catalog = new Catalog(this.events);
    this.cart = new Cart(this.events);
    this.buyer = new Buyer(this.events);

    this.api = new DataFromAPI(new Api(API_URL));

    this.headerView = new HeaderView(".header__container");
    this.modalView = new ModalView("#modal-container");
    this.cartView = new CartView(this.events);

    this.formView = new FormView(this.events);
  }

  init() {
    this.loadCatalog();
    this.initEvents();
  }

  private async loadCatalog() {
    try {
      this.catalog.setProducts(Array.from(await this.api.getAllProducts()));
    } catch (err) {
      console.error("Ошибка загрузки каталога:", err);
    }
  }

  private initEvents() {
    this.events.on("catalog:change", () => {
      this.catalogView.content = this.catalog.getProducts().map((product) => {
        const cardCatalog = new CardCatalogView(this.events, product);
        return cardCatalog.getElement();
      });
    });

    //открытие карточки товара при выборе карточки в каталоге
    this.events.on<{ id: string }>("card:select", ({ id }) => {
      const product = this.catalog.getProductById(id);
      if (!product) return;
      this.catalog.setSelectedProduct(product);
    });

    //отрисовка карточки товара при выборе карточки в каталоге
    this.events.on("card:render", () => {
      const selectedProduct = this.catalog.getSelectedProduct();
      if (!selectedProduct) return;

      this.previewCard = new CardPreviewView(this.events);
      this.previewCard.setCartChecker((productId) =>
        this.cart.isProductInCart(productId)
      );

      this.previewCard.product = selectedProduct;
      this.modalView.open(this.previewCard.getElement());
    });

    //изменение корзины
    this.events.on("cart:change", () => {
      this.cartView.totalPrice = getTotalPrice(this.cart.getProducts());
      this.cartView.content = this.cart.getProducts().map((product, index) => {
        return new CardInCartView(
          this.events,
          toCardInCartData(product),
          index
        ).getElement(); //this.cardView.getCardInCart(product, index).getElement();
      });
      this.headerView.counter = this.cart.getProducts().length;
      if (this.previewCard) this.previewCard.updateButton();
    });

    //добавление карточки в корзину
    this.events.on<IProduct>("cart:add", (product) => {
      this.cart.addProduct(product);
    });

    //удаление карточки из корзины (в модальном окне "карточка товара")
    this.events.on<{ id: string }>("cart:remove-by-id", ({ id }) => {
      this.cart.deleteProduct(id);
    });

    //Открытие корзины
    events.on("basket:open", () => {
      this.modalView.open(this.cartView.getElement());
    });

    //начало оформления заказа
    this.events.on("cart:order", () => {
      this.modalView.open(this.formView.getOrderForm().getElement());
    });

    this.events.on<{ name: string; value: string }>(
      "buyer:change",
      ({ name, value }) => {
        this.buyer.setData(name, value);
      }
    );

    this.events.on<TValidateErrors>("form:validate", (errors) => {
      this.formView.validate(errors);
    });

    //переход ко второй части оформления заказа
    events.on("order:next", () => {
      this.modalView.open(this.formView.getContactsForm().getElement());
    });

    //конец оформления заказа и отправка данных на сервер
    events.on("order:confirm", async () => {
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
      } catch (err) {
        console.error("Ошибка при заказе:", err);
      }
    });

    //закрытие модального окна после оформления заказа
    events.on("success:close", () => {
      if (this.previewCard) this.previewCard = null;
      this.modalView.close();
    });
  }
}
