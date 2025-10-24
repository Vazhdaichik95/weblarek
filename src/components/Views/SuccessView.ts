import { cloneTemplate } from "../../utils/utils";
import { Component } from "../base/Component";
import { events } from "../base/Events";

interface SuccessData {
  total: number;
}

export class SuccessView extends Component<SuccessData> {
  private element: HTMLElement;
  private descriptionEl: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor() {
    const rootContainer = cloneTemplate<HTMLElement>("#success");
    super(rootContainer);
    this.element = rootContainer;
    this.descriptionEl = this.element.querySelector(
      ".order-success__description"
    )!;
    this.closeButton = this.element.querySelector(".order-success__close")!;

    // обработчик кнопки закрытия
    this.closeButton.addEventListener("click", () => {
      events.emit("success:close", {});
    });
  }

  set total(value: number) {
    this.descriptionEl.textContent = `Списано ${value} синапсов`;
  }

  getElement(): HTMLElement {
    return this.element;
  }
}
