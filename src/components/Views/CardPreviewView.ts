import { IProduct } from "../../types/index";
import {
  cloneTemplate,
  ensureElement,
  resolveImagePath,
  setCategory,
} from "../../utils/utils";
import { Component } from "../base/Component";
import { events } from "../base/Events";

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

  private onCartValue = false;
  private checkInCart: ((id: string) => boolean) | null = null;

  constructor() {
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

    // обновление кнопки в открытой карточке при изменении корзины
    events.on("cart:changed", () => {
      if (this.product && this.checkInCart) {
        const inCart = this.checkInCart(this.product.id);
        this.updateButton(this.product, inCart);
      }
    });
  }

  // проверка на наличие в корзине
  public setCartChecker(fn: (id: string) => boolean) {
    this.checkInCart = fn;
  }

  set onCart(value: boolean) {
    this.onCartValue = value;
  }

  set product(productData: IProduct) {
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
    this.updateButton(productData, this.onCartValue);
  }

  getElement(): HTMLElement {
    return this.element;
  }

  /** Обновляет текст/состояние/обработчик кнопки */
  private updateButton(product: IProduct, inCart: boolean) {
    if (product.price === null) {
      this.priceElement.textContent = "Бесценно";
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = "Недоступно";
      this.buttonElement.onclick = null;
    } else {
      this.priceElement.textContent = `${product.price} синапсов`;
      this.buttonElement.disabled = false;
      this.buttonElement.onclick = null;

      if (inCart) {
        this.buttonElement.textContent = "Удалить из корзины";
        this.buttonElement.onclick = () => {
          events.emit("cart:remove-by-id", { id: product.id });
        };
      } else {
        this.buttonElement.textContent = "Купить";
        this.buttonElement.onclick = () => {
          events.emit("cart:add", product);
        };
      }
    }
  }
}
