import {renderElement, RenderPosition} from '../utils/render';

import EventComponent from "../components/event-template";
import EventEditFormComponent from "../components/addform";
import DayComponent from "../components/day";

const renderEvents = (container, events) => {
  const dates = new Set();
  events.forEach((event) => {
    const eventDate = new Date(event.startDate);
    const eventDateFormatted = `${eventDate.getFullYear()}/${eventDate.getMonth()}/${eventDate.getDate()}`;
    dates.add(eventDateFormatted);
  });


  Array.from(dates).forEach((date, index) => {
    const eventsOnDay = events.filter((ev) => {
      const eventDate = new Date(ev.startDate);
      const eventDateFormatted = `${eventDate.getFullYear()}/${eventDate.getMonth()}/${eventDate.getDate()}`;
      return eventDateFormatted === date;
    });

    const day = new DayComponent(index + 1, date).getElement();
    const eventsList = day.querySelector(`.trip-events__list`);
    eventsOnDay.map((event) => {
      const eventComponent = new EventComponent(event);
      const editEventComponent = new EventEditFormComponent(event);

      const rollupBtnHandler = () => {
        eventsList.replaceChild(editEventComponent.getElement(), eventComponent.getElement());
      };
      const formSubmitHandler = () => {
        eventsList.replaceChild(eventComponent.getElement(), editEventComponent.getElement());
      };

      eventComponent.setRollupBtnClickHandler(rollupBtnHandler);
      editEventComponent.setFormSubmitHandler(formSubmitHandler);

      renderElement(eventsList, eventComponent.getElement(), RenderPosition.BEFOREEND);
    });
    renderElement(container, day, RenderPosition.BEFOREEND);
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  render(events) {
    const container = this._container.getElement();

    renderEvents(container, events);
  }
}
