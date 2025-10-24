import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { events } from "../base/Events";

interface IHeaderData {
  counter: number;
}

export class HeaderView extends Component<IHeaderData> {
  protected counterElement: HTMLElement;
  protected cartButton: HTMLButtonElement;

  constructor(nameContainer: string) {
    const container = ensureElement<HTMLElement>(nameContainer);
    super(container);

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );
    this.cartButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );

    this.cartButton.addEventListener("click", () => {
      events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
