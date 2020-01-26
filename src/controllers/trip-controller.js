import {renderElement, RenderPosition} from '../utils/render';
import DayComponent from "../components/day";
import PointController from './point-controller';
import {ViewMode, EmptyEvent, SortType} from '../constants';
import NoPointsComponent from '../components/no-points';
import SortComponent from '../components/sort';

const renderEvents = (container, events, onDataChange, onViewChange, destinations, offers) => {
  const controllers = [];
  const dates = new Set();
  events.forEach((event) => {
    const eventDate = new Date(event.dateFrom);
    const eventDateFormatted = eventDate.toDateString();
    dates.add(eventDateFormatted);
  });


  Array.from(dates).forEach((date, index) => {
    const eventsOnDay = events.filter((ev) => {
      const eventDate = new Date(ev.dateFrom);
      const eventDateFormatted = eventDate.toDateString();
      return eventDateFormatted === date;
    });

    const day = new DayComponent(index + 1, date).getElement();
    const eventsList = day.querySelector(`.trip-events__list`);
    controllers.push(eventsOnDay.map((event) => {
      const pointController = new PointController(eventsList, onDataChange, onViewChange, offers, destinations);
      pointController.render(event);
      return pointController;
    }));
    renderElement(container, day, RenderPosition.BEFOREEND);
  });
  return controllers.reduce((a, b) => a.concat(b), []); // если нет initialValue, то в случае отсутствия элементов, попадающих под фильтр вылетает ошибка
};


export default class TripController {
  constructor(container, pointsModel, api) {
    this._container = container;

    this._api = api;

    this._pointsModel = pointsModel;
    this._pointControllers = [];
    this._creatingPoint = null;
    this._sortComponent = new SortComponent();
    this._noPointsComponent = new NoPointsComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const events = this._pointsModel.getPoints();
    const isNoPointsExist = events.length === 0;

    if (isNoPointsExist) {
      renderElement(container, this._noPointsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    this._renderPoints(events);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedPoints = [];

      switch (sortType) {
        case SortType.EVENT:
          sortedPoints = events;
          break;
        case SortType.TIME:
          sortedPoints = events.slice().sort((a, b) => b.duration - a.duration);
          break;
        case SortType.PRICE:
          sortedPoints = events.slice().sort((a, b) => b.price - a.price);
      }

      this._removePoints();
      this._renderPoints(sortedPoints);
    });
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    const container = this._container.getElement();

    this._creatingPoint = new PointController(container, this._onDataChange, this._onViewChange);
    this._creatingPoint.render(EmptyEvent, ViewMode.ADD);
  }

  _removePoints() {
    const container = this._container.getElement();
    this._pointControllers.forEach((controller) => controller.destroy());
    this._pointControllers = [];
    container.innerHTML = ``;
  }

  _renderPoints(events) {
    const container = this._container.getElement();

    if (events.length > 0 || this._creatingPoint) {
      renderElement(container, this._sortComponent.getElement(), RenderPosition.BEFOREBEGIN);
    }

    const pointControllers = renderEvents(container, events, this._onDataChange, this._onViewChange, this._pointsModel.getDestinations(), this._pointsModel.getOffers());
    this._pointControllers = this._pointControllers.concat(pointControllers);
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyEvent) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._removePoints();
        this._renderPoints(this._pointsModel.getPoints());
      } else {
        this._pointsModel.addPoint(newData);
        this._removePoints();
        this._renderPoints(this._pointsModel.getPoints());
      }
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._removePoints();
      this._renderPoints(this._pointsModel.getPoints());
    } else {
      this._api.updatePoint(oldData.id, newData)
      .then((pointModel) => {
        const isSuccess = this._pointsModel.updatePoint(oldData.id, pointModel);

        if (isSuccess) {
          pointController.render(newData, ViewMode.DEFAULT);
        }
      });
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => {
      it.setDefaultView();
    });
  }

  _onFilterChange() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints());
  }
}
