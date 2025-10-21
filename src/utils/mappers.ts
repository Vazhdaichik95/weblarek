import { CardViewData } from "../components/Views/CardCatalogView";
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