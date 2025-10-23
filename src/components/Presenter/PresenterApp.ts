import { DataFromAPI } from "../../communicate/DataFromAPI";
import { IProduct } from "../../types";
import { API_URL } from "../../utils/constants";
import { toCardInCartData } from "../../utils/mappers";
import { getTotalPrice } from "../../utils/utils";
import { Api } from "../base/Api";
import { EventEmitter } from "../base/Events";
import { Buyer } from "../Models/Buyer";
import { Cart } from "../Models/Cart";
import { Catalog } from "../Models/Catalog";
import { CardView } from "../Views/CardView";
import { CartView } from "../Views/CartView";
import { CatalogView } from "../Views/CatalogView";
import { HeaderView } from "../Views/HeaderView";
import { ModalView } from "../Views/ModalView";

export class PresenterApp {
  private catalog: Catalog;
  private cart: Cart;
  private buyer: Buyer;

  private api: DataFromAPI;

  private events: EventEmitter;

  private headerView: HeaderView;
  private modalView: ModalView;
  private cartView: CartView;
  private cardView: CardView;

  constructor(){
    this.catalog = new Catalog();
    this.cart = new Cart();
    this.buyer = new Buyer();

    this.api = new DataFromAPI(new Api(API_URL));

    this.events = new EventEmitter();

    this.headerView = new HeaderView(this.events, '.header__container');
    this.modalView = new ModalView(this.events, '#modal-container');
    this.cartView = new CartView(this.events);
    this.cardView = new CardView(this.events);
  }

  init() {
    this.loadCatalog();
    this.initEvents();
  }

  private async loadCatalog() {
    try{
      const catalogView = new CatalogView('.gallery');
      this.catalog.setProducts(Array.from(await this.api.getAllProducts()));
      console.log(this.catalog);
      catalogView.content = this.catalog.getProducts().map((product) => {
        const cardCatalog = this.cardView.getCardCatalog(product);
        return cardCatalog.getElement();
      });
    } catch(err) {
      console.error('Ошибка загрузки каталога:', err);
    }
  }

  private initEvents() {

    //открытие и отрисовка карточки товара при выборе карточки в каталоге
    this.events.on<{id: string}>('card:select', ({id}) => {
      const product = this.catalog.getProductById(id);
      if(!product) return;

      const cardPreview = this.cardView.getCardPreview();
      cardPreview.setCartChecker((productId) => this.cart.isProductInCart(productId));
      const inCart = this.cart.isProductInCart(product.id);
      this.modalView.open(cardPreview.render(product,inCart));
    });

    //добавление карточки в корзину
    this.events.on<IProduct>('cart:add', (product) => {
      this.cart.addProduct(product);
      this.cartView.totalPrice = getTotalPrice(this.cart.getProducts());
      this.cartView.content = this.cart.getProducts().map((product, index) => {
        return this.cardView.getCardInCart(product, index).getElement();
      });
      this.headerView.counter=this.cart.getProducts().length;
      this.events.emit('cart:changed');
    });

    //Открытие корзины
    this.events.on('basket:open', () => {
      this.modalView.open(this.cartView.getElement());
    });
  }
}