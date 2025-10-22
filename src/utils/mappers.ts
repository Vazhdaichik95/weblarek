import { CardViewData } from "../components/Views/CardCatalogView";
import { CartItemData } from "../components/Views/CartView";
import { IProduct } from "../types";

export function toCardViewData(products: IProduct[]): CardViewData[] {
  return products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price ?? null,
    category: p.category,//normalizeCategory(p.category),
    image: p.image,
  }));
}

export function toCartItemData(items: IProduct[]): CartItemData[] {
  return items.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price ?? 0,
  }));
}