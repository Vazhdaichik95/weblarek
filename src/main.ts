import { Buyer } from './components/Models/Buyer';
import { Cart } from './components/Models/Cart';
import { Catalog } from './components/Models/Catalog';
import './scss/styles.scss';
import { apiProducts } from './utils/data';

const catalog= new Catalog();
const cart = new Cart();
const buyer = new Buyer();
catalog.setProducts(apiProducts.items);

console.log('Массив товаров из каталога: ', catalog.getProducts());
console.log('Товар из каталога с id - c101ab44-ed99-4a54-990d-47aa2bb4e7d9: ', catalog.getProductById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));

const selectedProduct = catalog.getProductById('412bcf81-7e75-4e70-bdb9-d3c73c9803b7');
if(selectedProduct) catalog.setSelectedProduct(selectedProduct);

console.log('Товар выбранный покупателем: ', catalog.getSelectedProduct());

cart.addProduct(catalog.getProductById('412bcf81-7e75-4e70-bdb9-d3c73c9803b7'));
cart.addProduct(catalog.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));

console.log('Массив товаров из корзины: ', cart.getProducts());
console.log('Общая сумма заказа: ', cart.totalPrice());
console.log('Количество товаров в корзине: ', cart.countProducts());

cart.deleteProduct('412bcf81-7e75-4e70-bdb9-d3c73c9803b7');
console.log('Массив товаров из корзины: ', cart.getProducts());

cart.clearCart();
console.log('Массив товаров из корзины: ', cart.getProducts());


console.log('Валидация данных покупателя:', buyer.validateData());
buyer.setPayment('cash');
console.log('Валидация данных покупателя:', buyer.validateData());
buyer.setEmail('abcd@gmail.com');
buyer.setPhone('+7(900)123-45-67');
console.log('Валидация данных покупателя:', buyer.validateData());
buyer.setAddress('Россия');
console.log('Валидация данных покупателя:', buyer.validateData());

