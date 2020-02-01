import AbstractComponent from './abstract-component';

export const MenuItem = {
  TABLE: `control__points`,
  STATISTIC: `control__statistic`
};

const createMenuTemplate = () =>
  (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" id="control__points" href="#">Table</a>
      <a class="trip-tabs__btn" id="control__statistic" href="#">Stats</a>
    </nav>`
  );

export default class MenuComponent extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setActiveItem(menuItem) {
    this._skipActiveItem();
    const item = this.getElement().querySelector(`#${menuItem}`);

    if (item) {
      item.classList.add(`trip-tabs__btn--active`);
    }
  }

  _skipActiveItem() {
    const items = Object.values(MenuItem).map((item) => this.getElement().querySelector(`#${item}`));
    items.forEach((item) => item.classList.remove(`trip-tabs__btn--active`));
  }

  setOnClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.id;
      handler(menuItem);
    });
  }
}
