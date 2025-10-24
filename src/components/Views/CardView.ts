import { IProduct } from "../../types";
import { toCardCatalogData, toCardInCartData } from "../../utils/mappers";
import { CardCatalogView } from "./CardCatalogView";
import { CardInCartView } from "./CardInCartView";
import { CardPreviewView } from "./CardPreviewView";

export class CardView {
  getCardCatalog(product: IProduct) {
    return new CardCatalogView(toCardCatalogData(product));
  }

  getCardPreview() {
    return new CardPreviewView();
  }

  getCardInCart(product: IProduct, index: number) {
    return new CardInCartView(toCardInCartData(product), index);
  }
}
