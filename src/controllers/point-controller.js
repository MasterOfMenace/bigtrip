import EventComponent from '../components/event-template';
import EventEditFormComponent, {getOffersByType} from '../components/addform';
import {renderElement, RenderPosition, replace} from '../utils/render';
import {ViewMode, EmptyEvent} from '../constants';
import PointModel from '../models/point-model';

const SHAKE_TIMEOUT = 600;

const parseFormData = (event, offers, destinations, formData) => {
  const start = formData.get(`event-start-time`);
  const end = formData.get(`event-end-time`);
  const city = formData.get(`event-destination`);
  const type = formData.get(`event-type`);
  const destination = destinations.filter((it) => it.name === city).pop();
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

    const disableForm = () => {
      const form = this._editEventComponent.getElement().querySelector(`.trip-events__item`);
      form.classList.add(`event--blocked`);
      const submitButton = this._editEventComponent.getElement().querySelector(`.event__save-btn`);
      const deleteButton = this._editEventComponent.getElement().querySelector(`.event__reset-btn`);
      submitButton.setAttribute(`disabled`, `true`);
      deleteButton.setAttribute(`disabled`, `true`);
    };

    const rollupBtnHandler = () => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };
    const formSubmitHandler = (evt) => {
      evt.preventDefault();

      disableForm();

      const formData = this._editEventComponent.getData();
      const data = parseFormData(event, this._offers, this._destinations, formData);

      this._editEventComponent.setData({
        saveButtonText: `Saving...`
      });

      this._onDataChange(this, event, data);
    };

    this._editEventComponent.setDeleteButtonClickHandler(() => {
      this._editEventComponent.setData({
        deleteButtonText: `Deleting...`
      });

      disableForm();

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
          renderElement(this._container, this._eventComponent.getElement(), RenderPosition.BEFOREEND);
        }
        break;
      case ViewMode.ADD:
        if (oldEditEventComponent && oldEventComponent) {
          oldEventComponent.getElement().remove();
          oldEventComponent.removeElement();
          oldEditEventComponent.getElement().remove();
          oldEditEventComponent.removeElement();
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderElement(this._container, this._editEventComponent.getElement(), RenderPosition.AFTERBEGIN);
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

  _onEscKeyDown(evt) {
    const isEscPress = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscPress) {
      if (this._viewMode === ViewMode.ADD) {
        this._onDataChange(this, EmptyEvent, null);
      }
      this._replaceEditToEvent();
    }
  }

  destroy() {
    this._eventComponent.getElement().remove();
    this._eventComponent.removeElement();
    this._editEventComponent.getElement().remove();
    this._editEventComponent.removeElement();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._viewMode !== ViewMode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  shake() {
    this._editEventComponent.getElement().querySelector(`.trip-events__item`).style = `border: 1px solid red`;

    this._editEventComponent.getElement().style.animation = `shake ${SHAKE_TIMEOUT / 1000}s`;
    this._eventComponent.getElement().style.animation = `shake ${SHAKE_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._editEventComponent.getElement().style.animation = ``;
      this._eventComponent.getElement().style.animation = ``;

      this._editEventComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`
      });
    }, SHAKE_TIMEOUT);
  }
}
