import {renderElement, RenderPosition} from '../utils/render';
import DayComponent from "../components/day";
import PointController, {ViewMode, EmptyEvent} from './point-controller';

const renderEvents = (container, events, onDataChange, onViewChange) => {
  const controllers = [];
  const dates = new Set();
  events.forEach((event) => {
    const eventDate = new Date(event.startDate);
    const eventDateFormatted = eventDate.toDateString();
    dates.add(eventDateFormatted);
  });


  Array.from(dates).forEach((date, index) => {
    const eventsOnDay = events.filter((ev) => {
      const eventDate = new Date(ev.startDate);
      const eventDateFormatted = eventDate.toDateString();
      return eventDateFormatted === date;
    });

    const day = new DayComponent(index + 1, date).getElement();
    const eventsList = day.querySelector(`.trip-events__list`);
    controllers.push(eventsOnDay.map((event) => {
      const pointController = new PointController(eventsList, onDataChange, onViewChange);
      pointController.render(event);
      return pointController;
    }));
    renderElement(container, day, RenderPosition.BEFOREEND);
  });
  return controllers.reduce((a, b) => a.concat(b), []); // если нет initialValue, то в случае отсутствия элементов, попадающих под фильтр вылетает ошибка
};


export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;

    this._pointsModel = pointsModel;
    this._pointControllers = [];
    this._creatingPoint = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const events = this._pointsModel.getPoints();

    const pointControllers = renderEvents(container, events, this._onDataChange, this._onViewChange);
    this._pointControllers = this._pointControllers.concat(pointControllers);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    const container = this._container.getElement();

    this._creatingPoint = new PointController(container, this._onDataChange, this._onViewChange);
    this._creatingPoint.render(EmptyEvent, ViewMode.ADD);
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyEvent) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        const container = this._container.getElement();
        this._pointControllers.forEach((controller) => controller.destroy());
        this._pointControllers = [];
        container.innerHTML = ``;

        const events = this._pointsModel.getPoints();

        const pointControllers = renderEvents(container, events, this._onDataChange, this._onViewChange);
        this._pointControllers = this._pointControllers.concat(pointControllers);
      } else {
        this._pointsModel.addPoint(newData);
        // pointController.render(newData, ViewMode.DEFAULT);
        // иначе не рисуются дни
        const container = this._container.getElement();
        this._pointControllers.forEach((controller) => controller.destroy());
        this._pointControllers = [];
        container.innerHTML = ``;

        const events = this._pointsModel.getPoints();

        const pointControllers = renderEvents(container, events, this._onDataChange, this._onViewChange);
        this._pointControllers = this._pointControllers.concat(pointControllers);
      }
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);

      const container = this._container.getElement();
      this._pointControllers.forEach((controller) => controller.destroy());
      this._pointControllers = [];
      container.innerHTML = ``;

      const events = this._pointsModel.getPoints();

      const pointControllers = renderEvents(container, events, this._onDataChange, this._onViewChange);
      this._pointControllers = this._pointControllers.concat(pointControllers);
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, ViewMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => {
      it.setDefaultView();
    });
  }

  _onFilterChange() {
    const container = this._container.getElement();
    this._pointControllers.forEach((controller) => controller.destroy());
    this._pointControllers = [];
    container.innerHTML = ``; // иначе не удаляются номера дней

    const events = this._pointsModel.getPoints();

    const pointControllers = renderEvents(container, events, this._onDataChange, this._onViewChange);
    this._pointControllers = this._pointControllers.concat(pointControllers);
  }
}
