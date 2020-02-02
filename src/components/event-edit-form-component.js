import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import {EventTypes, EventTypesGroups, ViewMode} from '../constants.js';
import AbstractSmartComponent from './abstract-smart-component.js';

const ButtonData = {
  saveButtonText: `Save`,
  deleteButtonText: `Delete`
};

const createTypeMarkup = (eventType) => {
  const url = `img/icons/${eventType}.png`;

  return (`
  <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src=${url} alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">`);
};

const createTypeRadioMarkup = (eventType, checked) => {
  const {type, description} = eventType;
  const isChecked = checked === eventType.type;

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
  const evtTypesMarkup = typesList.map((it) => createGroups(types[it], currentType, EventTypesGroups[it])).join(`\n`);

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

const createEventDestinationCityMarkup = (destinations) => {
  return destinations.map((it) => (
    `<option value="${it.name}"></option>`
  )).join(`\n`);
};

const createEventDestinationMarkup = (eventType, destinations, destination) => {
  const typesList = Object.values(EventTypes).reduce((a, b) => a.concat(b));
  const typeDescription = typesList.find((it) => it.type === eventType).description;

  return (`<label class="event__label  event__type-output" for="event-destination-1">
  ${typeDescription}
  </label>
  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value='${destination ? destination : ``}' list="destination-list-1" placeholder='${destination ? `` : `choose your destination`}' autocomplete="off">
  <datalist id="destination-list-1">
    ${createEventDestinationCityMarkup(destinations)}
  </datalist>`);
};

const createEventTimesMarkup = (startTime, endTime) => {
  startTime = new Date(startTime);
  endTime = new Date(endTime);
  return (
    `<label class="visually-hidden" for="event-start-time-1">
    From
    </label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value='${startTime}'>
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">
      To
    </label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value='${endTime}'>`
  );
};

const createOfferMarkup = (offer, checked) => {
  const isChecked = checked.some((checkedOffer) => checkedOffer.title === offer.title);
  const actualOffer = isChecked ? checked.find((it) => it.title === offer.title) : offer;
  return (
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer" value="${offer.title}" ${isChecked ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-${offer.title}-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${actualOffer.price}</span>
    </label>
  </div>`
  );
};

const createShowplaceImageMarkup = (showplace) => {
  const {src, description} = showplace;
  return (
    `<img class="event__photo" src="${src}" alt="${description}">`
  );
};

const createDescriptionMarkup = (description, showplaces) => {
  if (!description) {
    return ``;
  }

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

export const getOffersByType = (offers, eventType) => {
  const offerModel = offers.find((it) => it.type === eventType);
  return offerModel.offers;
};

const createAddEventFormTemplate = (event, destinations, allOffers, options = {}) => {
  const {dateFrom, dateTo, basePrice, offers, isFavorite} = event;
  const {type, description, city, showplaces, mode, externalData, isDisable} = options;

  const {saveButtonText, deleteButtonText} = externalData;

  const offersByType = getOffersByType(allOffers, type);

  const typeMarkup = createEventTypeMarkup(EventTypes, type);
  const destinationMarkup = createEventDestinationMarkup(type, destinations, city);
  const timesMarkup = createEventTimesMarkup(dateFrom, dateTo);
  const checkedOffers = offers.slice();

  const offersMarkup = offersByType.map((offer) => createOfferMarkup(offer, checkedOffers)).join(`\n`);

  const descriptionMarkup = createDescriptionMarkup(description, showplaces);
  const isAdding = mode === ViewMode.ADD;

  const formDisableClass = isDisable ? `event--blocked` : ``;
  const buttonDisableAttribute = isDisable ? `disabled` : ``;

  return (
    `<div>
    <form class="trip-events__item  event  event--edit ${formDisableClass}" action="#" method="post">
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
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${buttonDisableAttribute}>${saveButtonText}</button>
      <button class="event__reset-btn" type="reset" ${buttonDisableAttribute}>${isAdding ? `Cancel` : `${deleteButtonText}`}</button>
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

      <section class="event__section  event__section--offers ${offersByType.length === 0 ? `visually-hidden` : ``}">
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

export default class EventEditFormComponent extends AbstractSmartComponent {
  constructor(event, mode, allDestinations, allOffers) {
    super();
    this._allDestinations = allDestinations;
    this._allOffers = allOffers;
    this._event = event;
    this._mode = mode;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;

    this._externalData = ButtonData;
    this._isDisable = false;

    this._type = event.type;
    this._city = event.destination.name ? event.destination.name : null;
    this._description = event.destination.description ? event.destination.description : null;
    this._showplaces = this._description ? event.destination.pictures.slice() : null;

    this._formSubmitHandler = null;
    this._favoriteBtnClickHandler = null;
    this._deleteButtonClickHandler = null;
    this.recoveryListeners();
    this._applyFlatpickr();
  }

  _setEventTypeChangeHandler() {
    const eventTypeGroups = this.getElement().querySelectorAll(`.event__type-group`);
    eventTypeGroups.forEach((group) => group.addEventListener(`change`, (evt) => {
      this._type = evt.target.value;
      this.rerender();
    }));
  }

  _setCityInputChangeHandler() {
    const cityInput = this.getElement().querySelector(`.event__input--destination`);
    cityInput.addEventListener(`change`, (evt) => {
      if (!evt.target.value) {
        this._city = null;
        this._description = null;
        this._showplaces = null;
        this.rerender();
      } else if (evt.target.value !== this._city) {
        this._city = he.decode(evt.target.value);
        const destination = this._allDestinations.find((it) => it.name === evt.target.value);
        this._description = destination.description;
        this._showplaces = destination.pictures.slice();
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
    let minEndDate = this._event.dateFrom;

    this._flatpickrStart = flatpickr(startDateElement, {
      'altInput': true,
      'allowInput': true,
      'defaultDate': this._event.dateFrom,
      'enableTime': true,
      'time_24hr': true,
      'dateFormat': `Z`,
      'altFormat': `d/m/y H:i`,
      onChange(selectedDate) {
        minEndDate = Date.parse(selectedDate);
      }
    });

    this._flatpickrEnd = flatpickr(endDateElement, {
      'altInput': true,
      'allowInput': true,
      'defaultDate': this._event.dateTo,
      'enableTime': true,
      'time_24hr': true,
      'altFormat': `d/m/y H:i`,
      'dateFormat': `Z`,
      'minDate': minEndDate,
      onOpen() {
        this.config.minDate = minEndDate;
      }

    });
  }

  getTemplate() {
    return createAddEventFormTemplate(this._event, this._allDestinations, this._allOffers, {
      type: this._type,
      city: this._city,
      description: this._description,
      showplaces: this._showplaces,
      mode: this._mode,
      externalData: this._externalData,
      isDisable: this._isDisable
    });
  }

  getData() {
    const form = this.getElement().querySelector(`.trip-events__item`);
    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, ButtonData, data);
    this.rerender();
  }

  disableForm() {
    this._isDisable = true;
    this.rerender();
  }

  enableForm() {
    this._isDisable = false;
    this.rerender();
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

    this._type = event.type;
    this._city = event.destination.name;
    this._description = event.destination.description;

    this.rerender();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }
}
