import { cloneTemplate, ensureElement } from "../../utils/utils";
import { events } from "../base/Events";

export interface ContactsData {
  email: string;
  phone: string;
}

export class ContactsFormView {
  private element: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private errorsEl: HTMLElement;
  private submitBtn: HTMLButtonElement;

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

    this.emailInput.addEventListener("input", () => this.updateState());
    this.phoneInput.addEventListener("input", () => this.updateState());

    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      const { valid } = this.validate();
      if (!valid) return;

      const data: ContactsData = {
        email: this.emailInput.value.trim(),
        phone: this.phoneInput.value.trim(),
      };

      events.emit<ContactsData>("order:confirm", data);
    });

    this.updateState();
  }

  getElement(): HTMLFormElement {
    return this.element;
  }

  private validate() {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();

    const emailOk = /\S+@\S+\.\S+/.test(email);
    const digits = phone.replace(/\D/g, "");
    const phoneOk = digits.length >= 10;

    const messages: string[] = [];
    if (!emailOk) messages.push("Неверный email");
    if (!phoneOk) messages.push("Неверный телефон");

    return {
      valid: emailOk && phoneOk,
      messages,
    };
  }

  private updateState() {
    const { valid, messages } = this.validate();
    this.submitBtn.disabled = !valid;
    this.errorsEl.textContent = valid ? "" : messages.join(", ");
  }
}
