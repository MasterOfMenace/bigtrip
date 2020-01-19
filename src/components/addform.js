import {createDescription, DescriptionItems, generateShowplaces} from '../mocks/event';
import {Offers, EventTypes, EventTypesGroups, ViewMode} from '../constants.js';
import {formatTime} from '../utils/utils';
import AbstractSmartComponent from './abstract-smart-component.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

const createTypeMarkup = (eventType) => {
  const {type} = eventType;
  const url = `img/icons/${type}.png`;

  return (`
  <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src=${url} alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">`);
};

const createTypeRadioMarkup = (eventType, checked) => {
  const {type, description} = eventType;
  const isChecked = checked === type;

  return (
    `
      <div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${description.split(` `).slice(0, 1)}</label>
      </div>
      `
  );
};

const createEventTypeMarkup = (types, currentType) => {
  const evtType = createTypeMarkup(currentType);
  const typesList = Object.keys(types);
  const evtTypesMarkup = typesList.map((it) => createGroups(types[it], currentType.type, EventTypesGroups[it])).join(`\n`);

  return (
    `<div class="event__type-wrapper">
    ${evtType}
    <div class="event__type-list">
      ${evtTypesMarkup}
    </div>
  </div>`
  );
};

const createGroups = (group, checked, title) => {
  const markup = group.map((it) => createTypeRadioMarkup(it, checked)).join(`\n`);
  return (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${title}</legend>
      ${markup}
    </fieldset>`
  );
};

const createEventDestinationMarkup = (eventType, city) => {

  const {description} = eventType;
  return (`<label class="event__label  event__type-output" for="event-destination-1">
  ${description}
  </label>
  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value='${city}' list="destination-list-1">
  <datalist id="destination-list-1">
    <option value="Amsterdam"></option>
    <option value="Geneva"></option>
    <option value="Chamonix"></option>
  </datalist>`);
};

const createEventTimesMarkup = (startTime, endTime) => {
  startTime = new Date(startTime);
  endTime = new Date(endTime);
  const startTimeFormatted = `${startTime.getFullYear()}/${startTime.getMonth() + 1}/${startTime.getDate()} ${formatTime(startTime.getHours())}:${formatTime(startTime.getMinutes())}`;
  const endTimeFormatted = `${endTime.getFullYear()}/${endTime.getMonth() + 1}/${endTime.getDate()} ${formatTime(endTime.getHours())}:${formatTime(endTime.getMinutes())}`;
  return (
    `<label class="visually-hidden" for="event-start-time-1">
    From
    </label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value='${startTimeFormatted}'>
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">
      To
    </label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value='${endTimeFormatted}'>`
  );
};

const createOfferMarkup = (offer, checked) => {

  const isChecked = checked.some((checkedOffer) => checkedOffer === offer.type);
  return (
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-1" type="checkbox" name="event-offer" value="${offer.type}" ${isChecked ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-${offer.type}-1">
      <span class="event__offer-title">${offer.name}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`
  );
};

const createShowplaceImageMarkup = (showplace) => {
  return (
    `<img class="event__photo" src="${showplace}" alt="Event photo">`
  );
};

const createDescriptionMarkup = (description, showplaces) => {
  description = description.join(` `);
  const showplacesMarkup = showplaces.map((it) => createShowplaceImageMarkup(it)).join(`\n`);
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${showplacesMarkup}
      </div>
    </section>`
  );
};

const createAddEventFormTemplate = (event, options = {}) => {
  const {startDate, endDate, price, offers, isFavorite} = event;
  const {type, description, city, showplaces, mode} = options;
  const typeMarkup = createEventTypeMarkup(EventTypes, type);
  const destinationMarkup = createEventDestinationMarkup(type, city);
  const timesMarkup = createEventTimesMarkup(startDate, endDate);
  const checkedOffers = Array.from(offers).map((offer) => offer.type);
  const offersMarkup = Offers.map((offer) => createOfferMarkup(offer, checkedOffers)).join(`\n`);
  const descriptionMarkup = createDescriptionMarkup(description, showplaces);
  const isAdding = mode === ViewMode.ADD;
  return (
    `<div>
    <form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      ${typeMarkup}
      <div class="event__field-group  event__field-group--destination">
        ${destinationMarkup}
      </div>

      <div class="event__field-group  event__field-group--time">
        ${timesMarkup}
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${isAdding ? `Cancel` : `Delete`}</button>
      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
      </label>

      <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
      </button>
    </header>

    <section class="event__details">

      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offersMarkup}
        </div>
      </section>

      ${descriptionMarkup}
    </section>
  </form>
  </div>`
  );
};

const parseFormData = (formData) => {
  return {
    city: formData.get(`event-destination`),
    offers: formData.getAll(`event-offer`),
    startDate: formData.get(`event-start-time`),
    endDate: formData.get(`event-end-time`),
    price: formData.get(`event-price`),
  };
};

export default class EventEditFormComponent extends AbstractSmartComponent {
  constructor(event, mode) {
    super();
    this._event = event;
    this._mode = mode;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;

    this._type = Object.assign({}, event.type);
    this._city = event.city;
    this._description = event.description.slice();
    this._showplaces = event.showplaces.slice();

    this._formSubmitHandler = null;
    this._favoriteBtnClickHandler = null;
    this._deleteButtonClickHandler = null;
    this.recoveryListeners();
    this._applyFlatpickr();
  }

  _setEventTypeChangeHandler() {
    const eventTypeGroups = this.getElement().querySelectorAll(`.event__type-group`);
    eventTypeGroups.forEach((group) => group.addEventListener(`change`, (evt) => {
      this._type.type = evt.target.value;
      const allTypes = Object.keys(EventTypes).map((it) => EventTypes[it]).reduce((a, b) => a.concat(b));
      allTypes.filter((it) => {
        if (it.type === evt.target.value) {
          this._type.description = it.description;
        }
      });
      this.rerender();
    }));
  }

  _setCityInputChangeHandler() {
    const cityInput = this.getElement().querySelector(`.event__input--destination`);
    cityInput.addEventListener(`change`, (evt) => {
      if (evt.target.value !== this._city) {
        this._city = evt.target.value;
        this._description = createDescription(DescriptionItems);
        this._showplaces = generateShowplaces();
        this.rerender();
      }
    });
  }

  _applyFlatpickr() {
    if (this._flatpickrStart && this._flatpickrEnd) {
      this._flatpickrStart.destroy();
      this._flatpickrEnd.destroy();
      this._flatpickrStart = null;
      this._flatpickrEnd = null;
    }

    const dateElements = this.getElement().querySelectorAll(`.event__input--time`);
    const startDateElement = dateElements[0];
    const endDateElement = dateElements[1];
    let minEndDate = this._event.startDate;

    this._flatpickrStart = flatpickr(startDateElement, {
      // altInput: true,
      allowInput: true,
      defaultDate: this._event.startDate,
      dateFormat: `d/m/y H:i`,
      // altFormat: `d/m/y H:i`,
      onChange(selectedDate) {
        minEndDate = Date.parse(selectedDate);
      }
    });

    this._flatpickrEnd = flatpickr(endDateElement, {
      // altInput: true,
      allowInput: true,
      defaultDate: this._event.endDate,
      dateFormat: `d/m/y H:i`,
      minDate: minEndDate,
      onOpen() {
        this.config.minDate = minEndDate;
      }

    });
  }

  getTemplate() {
    return createAddEventFormTemplate(this._event, {
      type: this._type,
      city: this._city,
      description: this._description,
      showplaces: this._showplaces,
      mode: this._mode,
    });
  }

  getData() {
    const event = this._event;
    const form = this.getElement().querySelector(`.trip-events__item`);
    const formData = new FormData(form);
    const parsedData = parseFormData(formData);
    const offersFromData = Offers.filter((offer) => { // не совсем уверен в этом коде, но вроде работает
      const isContain = parsedData.offers.includes(offer.type);
      if (isContain) {
        return offer;
      }
      return ``;
    });
    return {
      type: this._type,
      city: parsedData.city,
      offers: offersFromData,
      description: this._description,
      showplaces: this._showplaces,
      startDate: parsedData.startDate,
      endDate: parsedData.endDate,
      duration: event.duration,
      price: parsedData.price,
      isFavorite: event.isFavorite,
    };
  }

  setFormSubmitHandler(handler) {
    const form = this.getElement().querySelector(`form`);
    form.addEventListener(`submit`, handler);
    this._formSubmitHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, handler);
    this._favoriteBtnClickHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }

  recoveryListeners() {
    this.setFormSubmitHandler(this._formSubmitHandler);
    this.setFavoriteButtonClickHandler(this._favoriteBtnClickHandler);

    this._setEventTypeChangeHandler();
    this._setCityInputChangeHandler();
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
  }

  reset() {
    const event = this._event;

    this._type = Object.assign({}, event.type);
    this._city = event.city;
    this._description = event.description.slice();

    this.rerender();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }
}
