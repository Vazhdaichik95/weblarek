import { IProduct } from "../../types";

/**
 * Содержит в себе массив всех товаров и выбранную пользователем карточку.
 */
export class Catalog {
  private products: Map<string, IProduct>;
  private selectedProduct: IProduct | null;

  constructor(){
    this.products = new Map<string, IProduct>();
    this.selectedProduct=null;
  }

  /**
   * сохранение коллекции товаров, принимает массив товаров (IProduct[]).
   */
  setProducts(allProducts: IProduct[]){
    this.products=new Map(allProducts.map((product)=> [product.id, product]));
  }

  /**
   * получение массива товаров.
   */
  getProducts():IProduct[] {
    return Array.from(this.products.values());
  }

  /**
   * получение товара по id, принимает id товара (string).
   */
  getProductById(id:string):IProduct {
    let foundProduct: IProduct = {
      id: '',
      description: '',
      image: '',
      title: '',
      category: '',
      price: null
    };
    
    this.products.forEach((product, idProduct) => {
      if(idProduct === id) {
        foundProduct = product;
      }
    });
    return foundProduct;
  }

  /**
   * сохранение выбранного товара, принимает товар (IProduct).
   */
  setSelectedProduct(product: IProduct) {
    this.selectedProduct=product;
  }

  /**
   * получение выбранного массива. 
   */
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

}