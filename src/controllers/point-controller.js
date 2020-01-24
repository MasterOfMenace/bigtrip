import EventComponent from '../components/event-template';
import EventEditFormComponent from '../components/addform';
import {renderElement, RenderPosition, replace} from '../utils/render';
import {ViewMode, EmptyEvent} from '../constants';

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
      const data = this._editEventComponent.getData();
      this._onDataChange(this, event, data);
    };

    this._editEventComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, event, null));

    this._eventComponent.setRollupBtnClickHandler(rollupBtnHandler);
    this._editEventComponent.setFormSubmitHandler(formSubmitHandler);

    this._editEventComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite
      }));
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
}
