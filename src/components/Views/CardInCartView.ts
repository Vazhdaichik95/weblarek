import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export interface CardInCartData {
  id: string;
  title: string;
  price: number;
}

export class CardInCartView extends Component<CardInCartData> {
  container: HTMLElement;
  private indexCardElement: HTMLElement;
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;
  private deleteFromCartButton: HTMLButtonElement;

  constructor(
    protected events: EventEmitter,
    cardData: CardInCartData,
    index: number
  ) {
    const rootContainer = cloneTemplate<HTMLButtonElement>("#card-basket");
    super(rootContainer);
    this.container = rootContainer; //
    this.indexCardElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );
    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container
    );
    this.deleteFromCartButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    this.indexCardElement.textContent = String(index + 1);
    this.id = cardData.id;
    this.title = cardData.title;
    this.price = cardData.price;

    this.deleteFromCartButton.addEventListener("click", () => {
      this.events.emit("cart:remove-by-id", { id: cardData.id });
    });
  }

  set id(idData: string) {}

  set title(titleData: string) {
    this.titleElement.textContent = titleData;
  }

  set price(priceData: number) {
    this.priceElement.textContent = `${priceData} синапсов`;
  }

  getElement(): HTMLElement {
    return this.container;
  }
}
