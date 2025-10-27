import { ensureAllElements, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";

export class FormView {
  private form: HTMLFormElement;

  constructor(protected events: EventEmitter, formContainer: HTMLFormElement) {
    this.form = formContainer;

    this.initInputListeners();
  }

  private initInputListeners() {
    const inputs = ensureAllElements<HTMLInputElement>('.form__input', this.form);
    inputs.forEach((element) => {
      element.addEventListener("input", () => {
        this.events.emit("buyer:change", {
          name: element.name,
          value: element.value,
        });
      })
    });

    const toggleButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.form);
    toggleButtons.forEach((element) => {
      element.addEventListener("click", () => {
        element.classList.toggle('button_alt-active');
        toggleButtons.filter((el) => element.name!==el.name).forEach((el) => {
          el.classList.remove('button_alt-active');
        });
        this.events.emit("buyer:change", {
          name: "payment",
          value: element.name
        });
      });
    });
  }

  protected validateCommon(errors: {dataF: string; dataS: string}) {
    const errorsFlag = errors.dataF==="" && errors.dataS==="";

    const submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]');
    const errorElement = ensureElement<HTMLElement>('.form__errors');

    if (errorsFlag) {
      submitBtn.disabled = false;
      errorElement.textContent = "";
    } else {
      submitBtn.disabled = true;
      const errorsStr: string[] = [];
      if (errors.dataF !== "") errorsStr.push(errors.dataF);
      if (errors.dataS !== "") errorsStr.push(errors.dataS);
      errorElement.textContent = errorsStr.join(". ");
    }
  }
}
