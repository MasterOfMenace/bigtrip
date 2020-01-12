import EventComponent from '../components/event-template';
import EventEditFormComponent from '../components/addform';
import {renderElement, RenderPosition, replace} from '../utils/render';

export const ViewMode = {
  ADD: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};

export const EmptyEvent = {
  type: {
    type: `taxi`,
    description: `Taxi to`
  },
  city: ``,
  offers: [],
  description: [],
  showplaces: [],
  startDate: null,
  endDate: null,
  duration: null,
  price: ``,
  isFavorite: false,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._viewMode = ViewMode.DEFAULT;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._eventComponent = null;
    this._editEventComponent = null;
  }

  render(event, viewMode = ViewMode.DEFAULT) {
    const oldEventComponent = this._eventComponent;
    const oldEditEventComponent = this._editEventComponent;
    this._eventComponent = new EventComponent(event);
    this._editEventComponent = new EventEditFormComponent(event, viewMode);

    const rollupBtnHandler = () => {
      this._replaceEventToEdit();
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
  }

  destroy() {
    this._eventComponent.getElement().remove();
    this._eventComponent.removeElement();
    this._editEventComponent.getElement().remove();
    this._editEventComponent.removeElement();
  }

  setDefaultView() {
    if (this._viewMode !== ViewMode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }
}
