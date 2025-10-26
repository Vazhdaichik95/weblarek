import {
  cloneTemplate,
  ensureElement,
  resolveImagePath,
  setCategory,
} from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export interface CardCatalogData {
  id: string;
  title: string;
  price: number | null;
  category: string;
  image: string;
}

export class CardCatalogView extends Component<CardCatalogData> {
  private element: HTMLButtonElement;
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;

  constructor(protected events: EventEmitter, private data: CardCatalogData) {
    const rootContainer = cloneTemplate<HTMLButtonElement>("#card-catalog");
    super(rootContainer);
    this.element = rootContainer;
    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.element
    )!;
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.element
    )!;
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.element
    )!;
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.element
    )!;

    this.render(this.data);

    this.element.addEventListener("click", () => {
      this.events.emit("card:select", { id: this.data.id });
    });
  }

  render(data: CardCatalogData): HTMLButtonElement {
    this.data = data;

    this.titleElement.textContent = data.title;

    // Цена: если null → пишем "Бесценно"
    this.priceElement.textContent =
      data.price === null ? "Бесценно" : `${data.price} синапсов`;

    // Категория
    this.categoryElement = setCategory(data.category, this.categoryElement);

    // Картинка
    this.imageElement.src = resolveImagePath(data.image);
    this.imageElement.alt = data.title;

    return this.element;
  }

  getElement(): HTMLButtonElement {
    return this.element;
  }
}
