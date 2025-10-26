import { cloneTemplate, ensureElement } from "../../utils/utils";
import { events } from "../base/Events";
import { IBuyer } from "../../types";

type Payment = IBuyer["payment"]; // 'card' | 'cash'

export class OrderFormView {
  private element: HTMLFormElement;
  btnCard: HTMLButtonElement;
  btnCash: HTMLButtonElement;
  addressInput: HTMLInputElement;
  submitBtn: HTMLButtonElement;
  errorEl: HTMLElement;

  private state: { payment?: Payment; address: string } = { address: "" };

  constructor(initial?: Partial<IBuyer>) {
    this.element = cloneTemplate<HTMLFormElement>("#order");

    this.btnCard = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.element
    );
    this.btnCash = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.element
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.element
    );
    this.submitBtn = ensureElement<HTMLButtonElement>(
      ".order__button",
      this.element
    );
    this.errorEl = ensureElement<HTMLElement>(".form__errors", this.element);

    // префилл из initial
    if (initial?.payment) this.state.payment = initial.payment as Payment;
    if (initial?.address) this.state.address = initial.address;

    this.syncFromStateToView();

    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      events.emit("order:next");
    });
  }

  /** Вернуть разметку формы */
  getElement(): HTMLElement {
    return this.element;
  }

  setPayment(payment: Payment) {
    this.state.payment = payment;
    this.syncPaymentButtons();
  }

  setAddress(address: string) {
    this.state.address = address;
  }

  private syncFromStateToView() {
    this.addressInput.value = this.state.address ?? "";
    this.syncPaymentButtons();
  }

  private syncPaymentButtons() {
    const active = "button_alt-active";
    const normal = "button_alt";

    this.btnCard.classList.remove(active);
    this.btnCard.classList.add(normal);
    this.btnCash.classList.remove(active);
    this.btnCash.classList.add(normal);

    if (this.state.payment === "card") {
      this.btnCard.classList.add(active);
      this.btnCard.classList.remove(normal);
    } else if (this.state.payment === "cash") {
      this.btnCash.classList.add(active);
      this.btnCash.classList.remove(normal);
    }
  }
}
