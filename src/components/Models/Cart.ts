import { IProduct } from "../../types";

/**
 * Содержит в себе массив товаров, выбранных покупателем для покупки.
 */
export class Cart {
  private products: Map<string, IProduct>;

  constructor() {
    this.products = new Map<string, IProduct>();
  }

  /**
   * получение массива товаров
   */
  getProducts(): IProduct[] {
    return Array.from(this.products.values());
  }

  /**
   * добавление товара, принимает товар (IProduct), выбранный покупателем.
   */
  addProduct(product: IProduct) {
    this.products.set(product.id, product);
  }

  /**
   * удаление товара, принимает товар, который нужно удалить из корзины.
   */
  deleteProduct(product: IProduct) {
    this.products.delete(product.id);
  }

  /**
   * очищение корзины.
   */
  clearCart() {
    this.products.clear();
  }

  /**
   * получение общей суммы заказа
   */
  totalPrice(): number {
    let totalPrice: number=0;
    for(let product of this.products.values()) {
      totalPrice += product.price===null ? 0 : product.price;
    }
    return totalPrice;
  }

  /**
   * получение количества товаров в корзине.
   */
  countProducts(): number {
    return this.products.size;
  }

  /**
   * проверка наличия товара в корзине по id, принимает id товара.
   */
  isProductInCart(id:string):boolean {
    return this.products.get(id) !== undefined? true: false;
  }
}