import AbstractComponent from './abstract-component';
import {SortType} from '../constants';

const createSortItem = (sortType, defaultType) => {
  const isChecked = sortType === defaultType;
  return (
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
    <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" data-sort-type="${sortType}" ${isChecked ? `checked` : ``}>
    <label class="trip-sort__btn" for="sort-${sortType}">${sortType}</label>
  </div>`
  );
};

const createSortTemplate = (defaultType) => {
  const types = Object.values(SortType);
  const template = types.map((type) => createSortItem(type, defaultType)).join(`\n`);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day">Day</span>
    ${template}
    </form>`
  );
};

export default class SortComponent extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.EVENT;
    this._defaultSortType = SortType.EVENT;
  }

  getTemplate() {
    return createSortTemplate(this._defaultSortType);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}
