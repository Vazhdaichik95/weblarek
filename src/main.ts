import './scss/styles.scss';
import { PresenterApp } from './components/Presenter/PresenterApp';

const app = new PresenterApp();
app.init();
/*const catalog= new Catalog();//+
const cart = new Cart();//+
const buyer = new Buyer();//+

const api= new DataFromAPI(new Api(API_URL));//+

catalog.setProducts(Array.from(await api.getAllProducts()));//+
console.log('Массив товаров из каталога, полученный через API: ', catalog.getProducts());


const events = new EventEmitter();//+

const cartView = new CartView(events);//+

const catalogView = new CatalogView('.gallery');//+

const cards: HTMLElement[] = [];//+

toCardViewData(catalog.getProducts()).forEach((card) => {
  const cardView = new CardCatalogView(events, cloneTemplate<HTMLButtonElement>('#card-catalog') , card);
  cardView.render(card);
  cards.push(cardView.getElement());
});//+

catalogView.content=cards;//+

const modal = new ModalView(events, '#modal-container');//+

const header = new HeaderView(events, '.header__container');//+

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
}); //+

events.on<IProduct>('cart:add', (product) => {
  cart.addProduct(product);
  cartView.render(toCartItemData(cart.getProducts()));
  header.counter=cart.getProducts().length;
  events.emit('cart:changed');
});//+

events.on<{ index: number }>('cart:remove', ({ index }) => {
    const items = cart.getProducts();
    items.splice(index, 1);

    cart.clearCart();
    items.forEach(item => cart.addProduct(item));

    cartView.render(toCartItemData(cart.getProducts()));
    header.counter=cart.getProducts().length;
    events.emit('cart:changed');
  });

  events.on<{ id: string }>('cart:remove-by-id', ({ id }) => {
    cart.deleteProduct(id);
    cartView.render(toCartItemData(cart.getProducts()));
    header.counter=cart.getProducts().length;
    events.emit('cart:changed');
  });

  events.on('cart:order', () => {
    const orderForm = new OrderFormView(events, buyer.getBuyerData());
    modal.open(orderForm.getElement());
  });

  events.on<OrderNextPayload>('order:next', ({ payment, address }) => {
    buyer.setBuyerData({ payment, address });
    const contactsForm = new ContactsFormView(events);
    modal.open(contactsForm.getElement());
  });

  events.on<{ email: string; phone: string }>('order:confirm', async ({ email, phone }) => {
    buyer.setBuyerData({ email, phone });

      const order = {
        ...buyer.getBuyerData(),
        items: cart.getProducts().map((p) => p.id),
        total: cart.totalPrice(),
      };

      try {
        const result: { total: number } = await api.sendOrder(order);
        const success = new SuccessView(events);
        modal.open(success.render(result.total));

        cart.clearCart();
        cartView.render([]);
        header.counter=cart.getProducts().length;
      } catch (err) {
        console.error('Ошибка при заказе:', err);
      }
    });

  events.on('success:close', () => {
    modal.close();
  });
*/
