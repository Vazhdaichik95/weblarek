import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

/**
 * Содержит в себе массив всех товаров и выбранную пользователем карточку.
 */
export class Catalog {
  private products: Map<string, IProduct>;
  private selectedProduct: IProduct | null;

  constructor(protected events: EventEmitter) {
    this.products = new Map<string, IProduct>();
    this.selectedProduct = null;
  }

  /**
   * сохранение коллекции товаров, принимает массив товаров (IProduct[]).
   */
  setProducts(allProducts: IProduct[]) {
    this.products = new Map(
      allProducts.map((product) => [product.id, product])
    );
    this.events.emit("catalog:change");
  }

  /**
   * получение массива товаров.
   */
  getProducts(): IProduct[] {
    return Array.from(this.products.values());
  }

  /**
   * получение товара по id, принимает id товара (string).
   */
  getProductById(id: string): IProduct | undefined {
    return Array.from(this.products.values()).find(
      (product) => product.id === id
    );
  }

  /**
   * сохранение выбранного товара, принимает товар (IProduct).
   */
  setSelectedProduct(product: IProduct) {
    this.selectedProduct = product;
    this.events.emit("card:render");
  }

  /**
   * получение выбранного массива.
   */
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
