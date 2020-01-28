import {MonthNames} from '../constants.js';
import AbstractSmartComponent from './abstract-smart-component';

const getCities = (events) => {
  const cities = events.map((event) => event.destination.name);
  const startCity = cities[0];
  const endCity = cities[cities.length - 1];
  return [
    startCity,
    endCity
  ];
};

const getDates = (events) => {
  const dates = events.map((event) => event.dateFrom);
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

  const eventsCost = events.reduce((acc, current) => {
    return acc + current.basePrice;
  }, 0);

  const offers = events.reduce((a, b) => {
    return a.concat(b.offers);
  }, []);

  const offersPrice = offers.reduce((a, b) => a + b.price, 0);
  const totalPrice = eventsCost + offersPrice;

  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${startCity} &mdash; ... &mdash; ${endCity}</h1>

      <p class="trip-info__dates">${startMonth} ${startDay}&nbsp;&mdash;&nbsp;${endMonth} ${endDay}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
    </section>`
  );
};

export default class TripInfoComponent extends AbstractSmartComponent {
  constructor() {
    super();

    this._events = null;
  }

  recoveryListeners() {

  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }

  setEvents(events) {
    this._events = events;
  }

  resetEvents(newEvents) {
    this._events = newEvents;
  }

  rerender() {
    super.rerender();
  }
}
