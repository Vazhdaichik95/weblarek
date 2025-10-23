import { IProduct } from "../../types";
import { toCardCatalogData, toCardInCartData } from "../../utils/mappers";
import { IEvents } from "../base/Events";
import { CardCatalogView } from "./CardCatalogView";
import { CardInCartView } from "./CardInCartView";
import { CardPreviewView } from "./CardPreviewView";

export class CardView {

  constructor(protected events: IEvents) {
  }

  

  getCardCatalog(product: IProduct){
    return new CardCatalogView(this.events, toCardCatalogData(product));
  }

  getCardPreview() {
    return new CardPreviewView(this.events);
  }

  getCardInCart(product: IProduct, index: number) {
    return new CardInCartView(this.events, toCardInCartData(product), index);
  }
}