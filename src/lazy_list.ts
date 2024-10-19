const template = document.createElement("template");
template.innerHTML = `
<style>
#list {
  height: var(--height);
  width: var(--width);  
  border: var(--border);
  padding: var(--padding);
  overflow: scroll;
  scrollbar-width: none;
}
#spacer-top {
  width: 100%;
  height: 0px;
}
#spacer-bottom {
  width: 100%;
  height: 1000px;
}
</style>
<div id="list">
  <div id="spacer-top"></div>
  <slot></slot>
  <div id="spacer-bottom"></div>
</div>
`;

export type Renderer<T> = (item: T) => HTMLElement;

export class LazyList<T> extends HTMLElement {
  // By default, the list renders the items as div-s with strings in them.
  #renderFunction: Renderer<T> = (item) => {
    const element = document.createElement("div");
    element.innerText = JSON.stringify(item);
    return element;
  };

  // These could be useful properties to consider, but not mandatory to use.
  // Similarly, feel free to edit the shadow DOM template in any way you want.

  // By default, the list is empty.
  #data: T[] = [];

  // The index of the first visible data item.
  #visiblePosition: number = 0;

  #topOffsetElement: HTMLElement;

  #bottomOffsetElement: HTMLElement;

  #componentHeight = 350;
  #itemPerView = 5;

  // The container that stores the spacer elements and the slot where items are inserted.
  #listElement: HTMLElement;

  static register() {
    customElements.define("lazy-list", LazyList);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#topOffsetElement =
      this.shadowRoot.querySelector<HTMLElement>("#spacer-top")!;
    this.#bottomOffsetElement =
      this.shadowRoot.querySelector<HTMLElement>("#spacer-bottom")!;
    this.#listElement = this.shadowRoot.querySelector<HTMLElement>("#list")!;

    this.#listElement.onscroll = () => {
      this.#scrollPositionChanged(this.#listElement.scrollTop);
    };
  }

  setData(data: T[]) {
    this.#data = data;
    this.#redraw();
  }

  setRenderer(renderer: Renderer<T>) {
    this.#renderFunction = renderer;
    this.#redraw();
  }

  #redraw() {
    this.innerHTML = "";
    this.#data
      .slice(this.#visiblePosition, this.#visiblePosition + this.#itemPerView)
      .forEach((element) => {
        this.append(this.#renderFunction(element));
      });
  }

  #scrollPositionChanged(topOffset: number) {
    const index = Math.floor(topOffset / this.#componentHeight);
    this.#visiblePosition = index;

    this.#topOffsetElement.style.height = `${this.#visiblePosition * this.#componentHeight}px`;

    const remainingItems =
      this.#data.length - (this.#visiblePosition + this.#itemPerView);
    const bottomSpacerHeight = remainingItems * this.#componentHeight;
    this.#bottomOffsetElement.style.height = `${bottomSpacerHeight}px`;

    this.#listElement.scrollTop = topOffset;
    this.#redraw();
  }
}
