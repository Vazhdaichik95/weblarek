import { Component } from "../base/Component";

interface CatalogData {
  content: HTMLElement[];
}

export class CatalogView extends Component<CatalogData> {
  container: HTMLElement;

  constructor(rootContainer: HTMLElement) {
    super(rootContainer);

    this.container= rootContainer;
  }

  set content(items: HTMLElement[]) {
    this.container.innerHTML='';
    items.forEach((item) => {
      this.container.appendChild(item);
    });
  }
}