import { DataFromAPI } from './communicate/DataFromAPI';
import { Api } from './components/base/Api';
import { Buyer } from './components/Models/Buyer';
import { Cart } from './components/Models/Cart';
import { Catalog } from './components/Models/Catalog';
import './scss/styles.scss';
import { IProduct } from './types';
import { Header } from './components/Views/HeaderView';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import { Modal } from './components/Views/ModalView';
import { CardCatalogView } from './components/Views/CardCatalogView';
import { toCardViewData, toCartItemData } from './utils/mappers';
import { CatalogView } from './components/Views/CatalogView';
import { CardPreviewView } from './components/Views/CardPreviewView';
import { CartView } from './components/Views/CartView';

const catalog= new Catalog();
const cart = new Cart();
const buyer = new Buyer();

const api= new DataFromAPI(new Api(API_URL));

catalog.setProducts(Array.from(await api.getAllProducts()));
console.log('Массив товаров из каталога, полученный через API: ', catalog.getProducts());


const events = new EventEmitter();

const cartView = new CartView(events);

const gallery = ensureElement<HTMLElement>('.gallery');

const catalogView = new CatalogView(gallery);

const cards: HTMLElement[] = []

toCardViewData(catalog.getProducts()).forEach((card) => {
  const cardView = new CardCatalogView(events, cloneTemplate<HTMLButtonElement>('#card-catalog') , card);
  cardView.render(card);
  cards.push(cardView.getElement());
});

catalogView.content=cards;

const modalRoot = ensureElement<HTMLElement>('#modal-container');

const modal = new Modal(events, modalRoot);

const headerElem = ensureElement<HTMLElement>('.header__container');
const header = new Header(events, headerElem);

events.on('basket:open', () => {
  modal.open(cartView.getElement());
});

events.on<{id: string}>('card:select', ({id}) => {
  const product = catalog.getProductById(id);
  if(!product) return;

  const cardPreviewView = new CardPreviewView(events);
  cardPreviewView.setCartChecker((productId) => cart.isProductInCart(productId));
  const inCart = cart.isProductInCart(product.id);
  modal.open(cardPreviewView.render(product,inCart));
});

events.on<IProduct>('cart:add', (product) => {
  cart.addProduct(product);
  cartView.render(toCartItemData(cart.getProducts()));
  header.counter=cart.getProducts().length;
  events.emit('cart:changed');
})


