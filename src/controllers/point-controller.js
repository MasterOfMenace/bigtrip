import EventComponent from '../components/event-template';
import EventEditFormComponent from '../components/addform';
import {renderElement, RenderPosition, replace} from '../utils/render';

const ViewMode = {
  DEFAULT: `default`,
  EDIT: `edit`
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

  render(event) {
    const oldEventComponent = this._eventComponent;
    const oldEditEventComponent = this._editEventComponent;
    this._eventComponent = new EventComponent(event);
    this._editEventComponent = new EventEditFormComponent(event);

    const rollupBtnHandler = () => {
      this._replaceEventToEdit();
    };
    const formSubmitHandler = () => {
      this._replaceEditToEvent();
    };

    this._eventComponent.setRollupBtnClickHandler(rollupBtnHandler);
    this._editEventComponent.setFormSubmitHandler(formSubmitHandler);

    this._editEventComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite
      }));
    });

    if (oldEditEventComponent && oldEventComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._editEventComponent, oldEditEventComponent);
    } else {
      renderElement(this._container, this._eventComponent.getElement(), RenderPosition.BEFOREEND);
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
