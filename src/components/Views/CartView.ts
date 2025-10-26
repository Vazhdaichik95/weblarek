import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export interface CartData {
  content: HTMLElement[];
  totalPrice: number;
}

export class CartView extends Component<CartData> {
  private element: HTMLElement;
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor(protected events: EventEmitter) {
    const rootContainer = cloneTemplate<HTMLElement>("#basket");
    super(rootContainer);
    this.element = rootContainer;
    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.element
    )!;
    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.element
    )!;
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.element
    )!;

    this.orderButton.addEventListener("click", () => {
      this.events.emit("cart:order");
    });
  }

  set totalPrice(total: number) {
    this.totalElement.textContent = `${total} синапсов`;
  }

  /** Отрисовываем список товаров */
  set content(items: HTMLElement[]) {
    this.listElement.innerHTML = "";

    items.forEach((item) => {
      this.listElement.appendChild(item);
    });

    this.orderButton.disabled = items.length === 0;
  }

  getElement(): HTMLElement {
    return this.element;
  }
}
