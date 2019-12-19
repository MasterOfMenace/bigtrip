import {renderElement, RenderPosition} from './utils.js';

import TripInfoComponent from './components/tripinfo.js';
import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filter.js';
import EventComponent from './components/event-template.js';
import DayListComponent from './components/daylist.js';
import DayComponent from './components/day.js';
import EventEditFormComponent from './components/addform.js';

import {generateEvents} from './mocks/event.js';
import {generateFilters} from './mocks/filters.js';

const EVENTS_COUNT = 3;

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
      renderElement(eventsList, new EventComponent(event).getElement(), RenderPosition.BEFOREEND);
    });
    renderElement(container, day, RenderPosition.BEFOREEND);
  });
  renderElement(document.querySelector(`.trip-events__item`), new EventEditFormComponent(events[0]).getElement(), RenderPosition.AFTERBEGIN);
};

const events = generateEvents(EVENTS_COUNT).sort((a, b) => a.startDate - b.startDate);
const filters = generateFilters();

const tripInfoContainer = document.querySelector(`.trip-info`);

const tripInfoComponent = new TripInfoComponent(events);
const menuComponent = new MenuComponent();
const filtersComponent = new FiltersComponent(filters);

renderElement(tripInfoContainer, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);

const tripControls = document.querySelector(`.trip-controls`);
// const tripMenuTitle = tripControls.firstElementChild;
// const tripFiltersTitle = tripControls.lastElementChild;
// render(tripMenuTitle, createMenuTemplate(), `afterend`);
renderElement(tripControls, menuComponent.getElement(), RenderPosition.AFTERBEGIN); // подумать как засунуть под h2
renderElement(tripControls, filtersComponent.getElement(), RenderPosition.BEFOREEND);

const eventsContainer = document.querySelector(`.trip-events`);
renderElement(eventsContainer, new DayListComponent().getElement(), RenderPosition.BEFOREEND);
const dayList = eventsContainer.querySelector(`.trip-days`);

renderEvents(dayList, events);
