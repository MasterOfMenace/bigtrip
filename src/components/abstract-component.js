import {createElement} from "../utils/render";

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one. Нащальнике, нипалучаица((`);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate. Нащальнике, майфуне нету`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  show() {
    if (this._element) {
      this._element.classList.remove(`visually-hidden`);
    }
  }

  hide() {
    if (this._element) {
      this._element.classList.add(`visually-hidden`);
    }
  }
}
