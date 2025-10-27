import { TValidateErrors } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { FormView } from "./FormView";

export class OrderFormView extends FormView {
  private element: HTMLFormElement;

  constructor(protected events: EventEmitter) {
    const rootContainer = cloneTemplate<HTMLFormElement>("#order");

    super(events, rootContainer);

    this.element = rootContainer;

    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("order:next");
    });
  }
  
  validate(errors: TValidateErrors): void {
    this.validateCommon({dataF:errors.payment, dataS:errors.address});
  }

  /** Вернуть разметку формы */
  getElement(): HTMLFormElement {
    return this.element;
  }
}
