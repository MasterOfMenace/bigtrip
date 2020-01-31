import AbstractComponent from './abstract-component.js';
import moment from 'moment';

const createDayTemplate = (count, date) => {
  date = moment(new Date(date).toISOString()); // если не перевести дату в ISO, то в консоль падает deprecation warning
  const month = date.format(`MMM`);
  const day = date.format(`D`);
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

export default class DayComponent extends AbstractComponent {
  constructor(count, date) {
    super();
    this._count = count;
    this._date = date;
  }

  getTemplate() {
    return createDayTemplate(this._count, this._date);
  }
}
