import {formatTime, getDuration} from '../utils/utils';
import AbstractComponent from './abstract-component.js';
import {EventTypes} from '../constants';

const createEventTypeMarkup = (eventType, destination) => {
  const typesList = Object.values(EventTypes).reduce((a, b) => a.concat(b));
  const typeDescription = typesList.find((it) => it.type === eventType).description;

  const url = `img/icons/${eventType}.png`;

  return (
    `<div class="event__type">
      <img class="event__type-icon" width="42" height="42" src=${url} alt="Event type icon">
    </div>
    <h3 class="event__title">${typeDescription} ${destination}</h3>`
  );
};

const createOffersMarkup = (offers) => {
  offers = offers.slice(0, 3);
  return offers.map((offer) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>`
    );
  }).join(`\n`);
};

const createDurationMarkup = (event) => {
  const duration = getDuration(event);

  const days = duration.get(`days`);
  const hours = duration.get(`hours`);
  const minutes = duration.get(`minutes`);
  const daysFormatted = days <= 0 ? `` : `${days < 10 ? `0${days}D` : `${days}D`}`;
  const hoursFormatted = hours <= 0 ? `` : `${hours < 10 ? `0${hours}H` : `${hours}H`}`;
  const minutesFormatted = minutes <= 0 ? `` : `${minutes < 10 ? `0${minutes}M` : `${minutes}M`}`;

  return `${daysFormatted} ${hoursFormatted} ${minutesFormatted}`;
};

const createEventTemplate = (event) => {
  const {type, offers, dateFrom, dateTo, basePrice, destination} = event;
  const city = destination.name;


  const eventTypeMarkup = createEventTypeMarkup(type, city);
  return (
    `<li class="trip-events__item">
      <div class="event">
        ${eventTypeMarkup}
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time">${formatTime(dateFrom)}</time>
            &mdash;
            <time class="event__end-time">${formatTime(dateTo)}</time>
          </p>
          <p class="event__duration">${createDurationMarkup(event)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersMarkup(Array.from(offers))}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class EventComponent extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setRollupBtnClickHandler(handler) {
    const rollupBtn = this.getElement().querySelector(`.event__rollup-btn`);

    rollupBtn.addEventListener(`click`, handler);
  }
}
