import { cloneTemplate } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { CardInCartData } from './CardInCartView';

export interface CartData {
  content: HTMLElement[];
  totalPrice: number;
}

export class CartView extends Component<CartData>{
  private element: HTMLElement;
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor(protected events: IEvents) {
    const rootContainer = cloneTemplate<HTMLElement>('#basket');
    super(rootContainer);
    this.element = rootContainer;
    this.listElement = this.element.querySelector('.basket__list')!;
    this.totalElement = this.element.querySelector('.basket__price')!;
    this.orderButton = this.element.querySelector('.basket__button')!;

    this.orderButton.addEventListener('click', () => {
      events.emit('cart:order');
    });
  }

  set totalPrice(total: number) {
    this.totalElement.textContent = `${total} синапсов`;
  }

  /** Отрисовываем список товаров */
  set content(items: HTMLElement[]) {
    this.listElement.innerHTML = '';
    let total = 0;

    items.forEach((item) => {
      this.listElement.appendChild(item);
    });

    this.orderButton.disabled = items.length === 0;
  }

  getElement(): HTMLElement {
    return this.element;
  }
}
