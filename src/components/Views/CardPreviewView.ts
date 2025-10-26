import { IProduct } from "../../types/index";
import {
  cloneTemplate,
  ensureElement,
  resolveImagePath,
  setCategory,
} from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface CardPreviewData {
  product: IProduct;
  onCart: boolean;
}

export class CardPreviewView extends Component<CardPreviewData> {
  private element: HTMLElement;
  private titleElement: HTMLElement;
  private descriptionElement: HTMLElement;
  private priceElement: HTMLElement;
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private buttonElement: HTMLButtonElement;
  private productData: IProduct | null = null;

  private checkInCart: ((id: string) => boolean) | null = null;

  constructor(protected events: EventEmitter) {
    const rootContainer = cloneTemplate<HTMLElement>("#card-preview");
    super(rootContainer);
    this.element = rootContainer;
    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.element
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.element
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.element
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.element
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.element
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.element
    );
  }

  // проверка на наличие в корзине
  public setCartChecker(fn: (id: string) => boolean) {
    this.checkInCart = fn;
  }

  set product(productData: IProduct) {
    this.productData = productData;

    // Текстовые поля
    this.titleElement.textContent = productData.title;
    this.descriptionElement.textContent = productData.description || "";

    // Цена
    this.priceElement.textContent =
      productData.price === null ? "Бесценно" : `${productData.price} синапсов`;

    // Категория
    this.categoryElement = setCategory(
      productData.category,
      this.categoryElement
    );

    // Картинка
    this.imageElement.src = resolveImagePath(productData.image);
    this.imageElement.alt = productData.title;

    // Кнопка (зависит от onCart и цены)
    this.updateButton();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  /** Обновляет текст/состояние/обработчик кнопки */
  updateButton() {
    if (this.productData && this.checkInCart) {
      const inCart = this.checkInCart(this.productData.id);
      if (this.productData.price === null) {
        this.priceElement.textContent = "Бесценно";
        this.buttonElement.disabled = true;
        this.buttonElement.textContent = "Недоступно";
        this.buttonElement.onclick = null;
      } else {
        this.priceElement.textContent = `${this.productData.price} синапсов`;
        this.buttonElement.disabled = false;
        this.buttonElement.onclick = null;

        if (inCart) {
          this.buttonElement.textContent = "Удалить из корзины";
          this.buttonElement.onclick = () => {
            if (this.productData)
              this.events.emit("cart:remove-by-id", {
                id: this.productData.id,
              });
          };
        } else {
          this.buttonElement.textContent = "Купить";
          this.buttonElement.onclick = () => {
            if (this.productData)
              this.events.emit("cart:add", this.productData);
          };
        }
      }
    }
  }
}
