import EventComponent from '../components/event-component';
import EventEditFormComponent, {getOffersByType} from '../components/event-edit-form-component';
import {renderElement, RenderPosition, replace, remove} from '../utils/render';
import {ViewMode, EmptyEvent} from '../constants';
import PointModel from '../models/point-model';

const SHAKE_TIMEOUT = 600;

const parseFormData = (event, offers, destinations, formData) => {
  const start = formData.get(`event-start-time`);
  const end = formData.get(`event-end-time`);
  const city = formData.get(`event-destination`);
  const type = formData.get(`event-type`);
  const destination = destinations.find((it) => it.name === city);
  const offersFromForm = formData.getAll(`event-offer`);
  const currentOffersByType = getOffersByType(offers, type);
  const checkedOffers = currentOffersByType.filter((offer) => offersFromForm.includes(offer.title));

  return new PointModel({
    'id': event.id,
    'type': type,
    'destination': destination,
    'offers': checkedOffers,
    'date_from': new Date(start),
    'date_to': new Date(end),
    'base_price': Number(formData.get(`event-price`)),
    'is_favorite': event.isFavorite,
  });
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, offers, destinations) {
    this._container = container;
    this._viewMode = ViewMode.DEFAULT;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._offers = offers;
    this._destinations = destinations;

    this._eventComponent = null;
    this._editEventComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, viewMode = ViewMode.DEFAULT) {
    this._viewMode = viewMode;
    const oldEventComponent = this._eventComponent;
    const oldEditEventComponent = this._editEventComponent;
    this._eventComponent = new EventComponent(event);
    this._editEventComponent = new EventEditFormComponent(event, viewMode, this._destinations, this._offers);

    const rollupBtnHandler = () => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };
    const formSubmitHandler = (evt) => {
      evt.preventDefault();

      const formData = this._editEventComponent.getData();
      const data = parseFormData(event, this._offers, this._destinations, formData);

      this._editEventComponent.setData({
        saveButtonText: `Saving...`
      });

      this._editEventComponent.disableForm();

      this._onDataChange(this, event, data);
    };

    this._editEventComponent.setDeleteButtonClickHandler(() => {
      this._editEventComponent.setData({
        deleteButtonText: `Deleting...`
      });

      this._editEventComponent.disableForm();

      this._onDataChange(this, event, null);
    });

    this._eventComponent.setRollupBtnClickHandler(rollupBtnHandler);
    this._editEventComponent.setFormSubmitHandler(formSubmitHandler);

    this._editEventComponent.setFavoriteButtonClickHandler(() => {
      const newPoint = PointModel.clone(event);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._onDataChange(this, event, newPoint);
    });

    switch (viewMode) {
      case ViewMode.DEFAULT:
        if (oldEventComponent && oldEditEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._editEventComponent, oldEditEventComponent);
          this._replaceEditToEvent();
        } else {
          renderElement(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case ViewMode.ADD:
        if (oldEditEventComponent && oldEventComponent) {
          remove(oldEventComponent);
          remove(oldEditEventComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderElement(this._container, this._editEventComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  _replaceEventToEdit() {
    this._onViewChange();

    replace(this._editEventComponent, this._eventComponent);

    this._viewMode = ViewMode.EDIT;
  }

  _replaceEditToEvent() {
    this._editEventComponent.reset();

    replace(this._eventComponent, this._editEventComponent);

    this._viewMode = ViewMode.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._viewMode !== ViewMode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  shake() {
    const eventEditElement = this._editEventComponent.getElement();
    const eventElement = this._eventComponent.getElement();
    eventEditElement.querySelector(`.trip-events__item`).style = `border: 1px solid red`;

    eventEditElement.style.animation = `shake ${SHAKE_TIMEOUT / 1000}s`;
    eventElement.style.animation = `shake ${SHAKE_TIMEOUT / 1000}s`;

    setTimeout(() => {
      eventEditElement.style.animation = ``;
      eventElement.style.animation = ``;

      this._editEventComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`
      });
      this._editEventComponent.enableForm();
    }, SHAKE_TIMEOUT);
  }

  _onEscKeyDown(evt) {
    const isEscPress = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscPress) {
      if (this._viewMode === ViewMode.ADD) {
        this._onDataChange(this, EmptyEvent, null);
      }
      this._replaceEditToEvent();
    }
  }
}
