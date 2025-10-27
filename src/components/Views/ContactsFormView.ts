import { TValidateErrors } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { FormView } from "./FormView";

export interface ContactsData {
  email: string;
  phone: string;
}

export class ContactsFormView extends FormView{
  private element: HTMLFormElement;

  constructor(protected events: EventEmitter) {
    const rootContainer = cloneTemplate<HTMLFormElement>("#contacts");

    super(events, rootContainer);
    
    this.element = rootContainer;

    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("order:confirm");
    });
  }

  validate(errors: TValidateErrors): void {
      this.validateCommon({dataF:errors.email, dataS:errors.phone});
  }

  getElement(): HTMLFormElement {
    return this.element;
  }
}
