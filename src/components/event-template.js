import {formatTime} from '../utils.js';
import AbstractComponent from './abstract-component.js';

const getDuration = (timestamp) => {
  const duration = new Date(timestamp);
  const days = duration.getDate() > 0 ? `${duration.getDate()}D` : ``;
  const hours = duration.getHours() > 0 ? `${duration.getHours()}H` : ``;
  const minutes = `${duration.getMinutes()}M`;
  return `${formatTime(days)} ${formatTime(hours)} ${formatTime(minutes)}`;
};

const createEventTypeMarkup = (eventType, destination) => {
  const {type, description} = eventType;
  const url = `img/icons/${type}.png`;

  return (
    `<div class="event__type">
      <img class="event__type-icon" width="42" height="42" src=${url} alt="Event type icon">
    </div>
    <h3 class="event__title">${description} ${destination}</h3>`
  );
};

const createOffersMarkup = (offers) => {
  return offers.map((offer) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>`
    );
  }).join(`\n`);
};

const createEventTemplate = (event) => {
  const {type, city, offers, startDate, endDate, duration, price} = event;
  const dateStart = new Date(startDate);
  const dateEnd = new Date(endDate);

  const eventTypeMarkup = createEventTypeMarkup(type, city);
  return (
    `<li class="trip-events__item">
      <div class="event">
        ${eventTypeMarkup}
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time">${formatTime(dateStart.getHours())}:${formatTime(dateStart.getMinutes())}</time>
            &mdash;
            <time class="event__end-time">${formatTime(dateEnd.getHours())}:${formatTime(dateEnd.getMinutes())}</time>
          </p>
          <p class="event__duration">${getDuration(duration)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
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
}
