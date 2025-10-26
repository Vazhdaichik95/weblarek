import { TValidateErrors } from "../../types";
import { EventEmitter } from "../base/Events";
import { ContactsFormView } from "./ContactsFormView";
import { OrderFormView } from "./OrderFormView";

export class FormView {
  private orderForm: OrderFormView;
  private contactsForm: ContactsFormView;

  constructor(protected events: EventEmitter) {
    this.orderForm = new OrderFormView();
    this.contactsForm = new ContactsFormView();

    this.orderForm.addressInput.addEventListener("input", () => {
      this.orderForm.setAddress(this.orderForm.addressInput.value.trim());
      this.events.emit("buyer:change", {
        name: this.orderForm.addressInput.name,
        value: this.orderForm.addressInput.value,
      });
    });

    this.orderForm.btnCard.addEventListener("click", () => {
      this.orderForm.setPayment("card");
      this.events.emit("buyer:change", { name: "payment", value: "card" });
    });

    this.orderForm.btnCash.addEventListener("click", () => {
      this.orderForm.setPayment("cash");
      this.events.emit("buyer:change", { name: "payment", value: "cash" });
    });

    this.contactsForm.emailInput.addEventListener("input", () => {
      this.events.emit("buyer:change", {
        name: this.contactsForm.emailInput.name,
        value: this.contactsForm.emailInput.value,
      });
    });

    this.contactsForm.phoneInput.addEventListener("input", () => {
      this.events.emit("buyer:change", {
        name: this.contactsForm.phoneInput.name,
        value: this.contactsForm.phoneInput.value,
      });
    });
  }

  validate(errors: TValidateErrors) {
    const firstStepErrors: boolean =
      errors.address === "" && errors.payment === "";
    const secondStepErrors: boolean =
      firstStepErrors && errors.email === "" && errors.phone === "";

    if (firstStepErrors) {
      this.orderForm.submitBtn.disabled = false;
      this.orderForm.errorEl.textContent = "";
    } else {
      this.orderForm.submitBtn.disabled = true;
      const errorsStr: string[] = [];
      if (errors.payment !== "") errorsStr.push(errors.payment);
      if (errors.address !== "") errorsStr.push(errors.address);
      this.orderForm.errorEl.textContent = errorsStr.join(". ");
    }

    if (secondStepErrors) {
      this.contactsForm.submitBtn.disabled = false;
      this.contactsForm.errorsEl.textContent = "";
    } else {
      this.contactsForm.submitBtn.disabled = true;
      const errorsStr: string[] = [];
      if (errors.email !== "") errorsStr.push(errors.email);
      if (errors.phone !== "") errorsStr.push(errors.phone);
      this.contactsForm.errorsEl.textContent = errorsStr.join(". ");
    }
  }

  getOrderForm(): OrderFormView {
    return this.orderForm;
  }

  getContactsForm(): ContactsFormView {
    return this.contactsForm;
  }
}
