import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ModalData {
    content: HTMLElement;
}

export class Modal extends Component<ModalData> {
    protected rootContainer: HTMLElement;
    protected container: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(protected events: IEvents, rootContainer: HTMLElement) {
        super(rootContainer);
        this.rootContainer=rootContainer;

        this.container = ensureElement<HTMLElement>('.modal__content', rootContainer);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', rootContainer);

        this.closeButton.addEventListener('click', () => {
            this.close();
            this.events.emit('modal:close');
        });
    }

    set content(element: HTMLElement) {
        this.container.replaceChildren(element);
        this.rootContainer.classList.add('modal_active');
    }

    open(contentElement: HTMLElement) {
        this.container.replaceChildren(contentElement);
        this.rootContainer.classList.add('modal_active');
    }

    close() {
        this.rootContainer.classList.remove('modal_active');
        this.container.replaceChildren();
    }
}