import {MonthNames} from '../constants.js';
import {createElement} from '../utils.js';

const getCities = (events) => {
  const cities = events.map((event) => event.city);
  const startCity = cities[0];
  const endCity = cities[cities.length - 1];
  return [
    startCity,
    endCity
  ];
};

const getDates = (events) => {
  const dates = events.map((event) => event.startDate);
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];

  return [
    startDate,
    endDate
  ];
};

const createTripInfoTemplate = (events) => {
  let [startCity, endCity] = getCities(events);
  let [startDate, endDate] = getDates(events);
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  const startMonth = MonthNames[startDate.getMonth()];
  const startDay = startDate.getDate();
  const endMonth = MonthNames[endDate.getMonth()];
  const endDay = endDate.getDate();
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${startCity} &mdash; ... &mdash; ${endCity}</h1>

      <p class="trip-info__dates">${startMonth} ${startDay}&nbsp;&mdash;&nbsp;${endMonth} ${endDay}</p>
    </div>`
  );
};

// export {createTripInfoTemplate};

export default class TripInfoComponent {
  constructor(events) {
    this._events = events;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
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
