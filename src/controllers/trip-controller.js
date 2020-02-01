import {renderElement, RenderPosition} from '../utils/render';
import DayComponent from "../components/day";
import PointController from './point-controller';
import {ViewMode, EmptyEvent, SortType} from '../constants';
import NoPointsComponent from '../components/no-points';
import SortComponent from '../components/sort';
import {getDuration} from '../utils/utils';

const getSortedDates = (a, b) => {
  const first = Date.parse(a);
  const second = Date.parse(b);
  return first - second;
};

const renderEvent = (container, event, onDataChange, onViewChange, destinations, offers) => {
  const pointController = new PointController(container, onDataChange, onViewChange, offers, destinations);
  pointController.render(event);
  return pointController;
};

const renderEvents = (container, events, onDataChange, onViewChange, destinations, offers) => {
  const controllers = [];
  const dates = new Set();
  events.forEach((event) => {
    const eventDate = new Date(event.dateFrom);
    const eventDateFormatted = eventDate.toDateString();
    dates.add(eventDateFormatted);
  });

  Array.from(dates).sort(getSortedDates).forEach((date, index) => {
    const eventsOnDay = events.filter((ev) => {
      const eventDate = new Date(ev.dateFrom);
      const eventDateFormatted = eventDate.toDateString();
      return eventDateFormatted === date;
    });

    const day = new DayComponent(index + 1, date).getElement();
    const eventsList = day.querySelector(`.trip-events__list`);
    controllers.push(eventsOnDay.map((event) => renderEvent(eventsList, event, onDataChange, onViewChange, destinations, offers)));
    renderElement(container, day, RenderPosition.BEFOREEND);
  });
  return controllers.reduce((a, b) => a.concat(b), []); // если нет initialValue, то в случае отсутствия элементов, попадающих под фильтр вылетает ошибка
};

const renderSortEvents = (container, events, onDataChange, onViewChange, destinations, offers) => {
  const controllers = [];
  const day = new DayComponent().getElement();
  const eventsList = day.querySelector(`.trip-events__list`);
  controllers.push(events.map((event) => renderEvent(eventsList, event, onDataChange, onViewChange, destinations, offers)));
  renderElement(container, day, RenderPosition.BEFOREEND);
  return controllers.reduce((a, b) => a.concat(b), []);
};


export default class TripController {
  constructor(container, pointsModel, api, tripInfoComponent) {
    this._container = container;

    this._api = api;

    this._pointsModel = pointsModel;
    this._pointControllers = [];
    this._creatingPoint = null;
    this._sortComponent = new SortComponent();
    this._noPointsComponent = new NoPointsComponent();

    this._tripInfoComponent = tripInfoComponent;

    this._sortType = SortType.EVENT;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  show() {
    this._container.show();
    this._sortComponent.show();
  }

  hide() {
    this._container.hide();
    this._sortComponent.hide();
  }

  render() {
    const container = this._container.getElement();
    const events = this._pointsModel.getPoints();
    const isNoPointsExist = events.length === 0;

    if (events.length > 0 || this._creatingPoint) {
      renderElement(container, this._sortComponent.getElement(), RenderPosition.BEFOREBEGIN);
    }

    if (isNoPointsExist) {
      renderElement(container, this._noPointsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    this._renderPoints();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      this._sortType = sortType;

      this._renderPoints();
    });
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    const container = this._container.getElement();

    this._creatingPoint = new PointController(container, this._onDataChange, this._onViewChange, this._pointsModel.getOffers(), this._pointsModel.getDestinations());
    this._creatingPoint.render(EmptyEvent, ViewMode.ADD);
  }

  _removePoints() {
    const container = this._container.getElement();
    this._pointControllers.forEach((controller) => controller.destroy());
    this._pointControllers = [];
    container.innerHTML = ``;
  }

  _renderPoints() {
    const container = this._container.getElement();

    let sortedPoints = [];

    switch (this._sortType) {
      case SortType.EVENT:
        sortedPoints = this._pointsModel.getPoints();
        break;
      case SortType.TIME:
        sortedPoints = this._pointsModel.getPoints().slice().sort((a, b) => getDuration(b) - getDuration(a));
        break;
      case SortType.PRICE:
        sortedPoints = this._pointsModel.getPoints().slice().sort((a, b) => b.basePrice - a.basePrice);
        break;
    }

    if (this._sortType === SortType.EVENT) {
      this._removePoints();
      this._pointControllers = renderEvents(container, sortedPoints, this._onDataChange, this._onViewChange, this._pointsModel.getDestinations(), this._pointsModel.getOffers());
    } else {
      this._removePoints();
      this._pointControllers = renderSortEvents(container, sortedPoints, this._onDataChange, this._onViewChange, this._pointsModel.getDestinations(), this._pointsModel.getOffers());
    }
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyEvent) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._removePoints();
        this._renderPoints();
      } else {
        this._api.createPoint(newData)
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);
            this._removePoints();
            this.render();
            this._tripInfoComponent.resetEvents(this._pointsModel.getPoints());
            this._tripInfoComponent.rerender();
          })
          .catch(() => pointController.shake());
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._removePoints();
          this.render();
          this._tripInfoComponent.resetEvents(this._pointsModel.getPoints());
          this._tripInfoComponent.rerender();
        })
        .catch(() => pointController.shake());
    } else {
      this._api.updatePoint(oldData.id, newData)
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(oldData.id, pointModel);

          if (isSuccess) {
            pointController.render(newData, ViewMode.DEFAULT);
            this._removePoints();
            this.render();
            this._tripInfoComponent.resetEvents(this._pointsModel.getPoints());
            this._tripInfoComponent.rerender();
          }
        })
        .catch(() => pointController.shake());
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => {
      it.setDefaultView();
    });
  }

  _onFilterChange() {
    this._removePoints();
    this._renderPoints();
  }
}
