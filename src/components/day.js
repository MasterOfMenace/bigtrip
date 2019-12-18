import {MonthNames} from '../constants.js';
import {createElement} from '../utils.js';

const createDayTemplate = (count, date) => {
  // console.log(typeof events);
  date = new Date(date);
  const month = MonthNames[date.getMonth() + 1];
  const day = date.getDate();
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count}</span>
        <time class="day__date" datetime="2019-03-18">${month} ${day}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

// export {createDayTemplate};

export default class DayComponent {
  constructor(count, date) {
    this._count = count;
    this._date = date;
    // this._event = event;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._count, this._date);
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
}
