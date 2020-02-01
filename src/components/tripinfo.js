import moment from 'moment';
import AbstractSmartComponent from './abstract-smart-component';

const getCities = (events) => {
  const cities = events.map((event) => event.destination.name);
  return cities;
};

const getDates = (events) => {
  const startDate = events[0].dateFrom;
  const endDate = events[events.length - 1].dateTo;

  return [
    startDate,
    endDate
  ];
};

const createTripInfoTitle = (cities) => {
  let [startCity, secondCity, endCity, ...rest] = [];
  if (cities.length > 3) {
    [startCity, ...rest] = cities;
    endCity = rest[rest.length - 1];
    return `<h1 class="trip-info__title">${startCity} &mdash; ... &mdash; ${endCity}</h1>`;
  } else if (cities.length === 3) {
    [startCity, secondCity, endCity] = cities;
    return `<h1 class="trip-info__title">${startCity} &mdash; ${secondCity} &mdash; ${endCity}</h1>`;
  } else {
    [startCity, endCity] = cities;
    return `<h1 class="trip-info__title">${startCity} &mdash; ${endCity}</h1>`;
  }
};

const createTripInfoTemplate = (events) => {
  const tripInfoTitle = createTripInfoTitle(getCities(events));
  let [startDate, endDate] = getDates(events);
  startDate = moment(startDate);
  endDate = moment(endDate);
  const startMonth = startDate.format(`MMM`);
  const startDay = startDate.format(`D`);
  const endMonth = endDate.format(`MMM`);
  const endDay = endDate.format(`D`);

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
      ${tripInfoTitle}

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
