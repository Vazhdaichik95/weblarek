import { cloneTemplate, ensureElement } from "../../utils/utils";
import { events } from "../base/Events";

export interface ContactsData {
  email: string;
  phone: string;
}

export class ContactsFormView {
  private element: HTMLFormElement;
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;
  errorsEl: HTMLElement;
  submitBtn: HTMLButtonElement;

  constructor() {
    this.element = cloneTemplate<HTMLFormElement>("#contacts");

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.element
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.element
    );
    this.errorsEl = ensureElement<HTMLElement>(".form__errors", this.element);
    this.submitBtn = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.element
    );

    this.element.addEventListener("submit", (e) => {
      e.preventDefault();

      events.emit("order:confirm");
    });
  }

  getElement(): HTMLFormElement {
    return this.element;
  }
}
