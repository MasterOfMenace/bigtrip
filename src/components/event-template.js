import {formatTime, getDuration} from '../utils/utils';
import AbstractComponent from './abstract-component.js';

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
  const {type, city, offers, startDate, endDate, price} = event;

  const eventTypeMarkup = createEventTypeMarkup(type, city);
  return (
    `<li class="trip-events__item">
      <div class="event">
        ${eventTypeMarkup}
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time">${formatTime(startDate)}</time>
            &mdash;
            <time class="event__end-time">${formatTime(endDate)}</time>
          </p>
          <p class="event__duration">${getDuration(startDate, endDate)}</p>
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

  setRollupBtnClickHandler(handler) {
    const rollupBtn = this.getElement().querySelector(`.event__rollup-btn`);

    rollupBtn.addEventListener(`click`, handler);
  }
}
