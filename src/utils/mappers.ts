import { CardCatalogData } from "../components/Views/CardCatalogView";
import { CardInCartData } from "../components/Views/CardInCartView";
import { IProduct } from "../types";

export function toCardCatalogData(product: IProduct): CardCatalogData {
    return {
      id: product.id,
      title: product.title,
      price: product.price ?? null,
      category: product.category,//normalizeCategory(p.category),
      image: product.image,
    }
  };

export function toCardInCartData(product: IProduct): CardInCartData {
  return {
    id: product.id,
    title: product.title,
    price: product.price ?? 0,
  };
}