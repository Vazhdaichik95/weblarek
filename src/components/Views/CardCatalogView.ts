import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface CardViewData {
  id: string;
  title: string;
  price: number | null;
  category: string;
  image: string;
}

export class CardCatalogView extends Component<CardViewData>{
  private element: HTMLButtonElement;
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;

  constructor(protected events: IEvents, rootContainer: HTMLElement, private data: CardViewData) {
    super(rootContainer);
    this.element = cloneTemplate<HTMLButtonElement>('#card-catalog');
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.element)!;
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.element)!;
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.element)!;
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.element)!;

    this.render(this.data);
  }

  render(data: CardViewData): HTMLButtonElement {
    this.data = data;

    this.titleElement.textContent = data.title;

    // Цена: если null → пишем "Бесценно"
    this.priceElement.textContent =
      data.price === null ? 'Бесценно' : `${data.price} синапсов`;

    // Категория
    this.categoryElement.textContent = data.category;
    //this.setCategory(data.category);

    // Картинка
    this.imageElement.src = data.image;//resolveImagePath(data.image);
    this.imageElement.alt = data.title;

    return this.element;
  }

  getElement(): HTMLButtonElement {
    return this.element;
  }
}