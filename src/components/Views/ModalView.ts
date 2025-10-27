import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { events } from "../base/Events";

interface ModalData {
  content: HTMLElement;
}

export class ModalView extends Component<ModalData> {
  protected rootContainer: HTMLElement;
  protected container: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected activeContent: HTMLElement | null = null;

  constructor(nameContainer: string) {
    const rootContainer = ensureElement<HTMLElement>(nameContainer);
    super(rootContainer);
    this.rootContainer = rootContainer;

    this.container = ensureElement<HTMLElement>(
      ".modal__content",
      rootContainer
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      rootContainer
    );

    this.closeButton.addEventListener("click", () => {
      this.close();
      events.emit("modal:close");
    });
  }

  set content(element: HTMLElement) {
    this.container.replaceChildren(element);
    this.rootContainer.classList.add("modal_active");
  }

  getActiveContent(): HTMLElement | null {
    return this.activeContent;
  }

  open(contentElement: HTMLElement) {
    this.activeContent = contentElement;
    this.container.replaceChildren(contentElement);
    this.rootContainer.classList.add("modal_active");
  }

  close() {
    this.activeContent = null;
    this.rootContainer.classList.remove("modal_active");
    this.container.replaceChildren();
  }
}
