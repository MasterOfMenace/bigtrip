import {renderElement, RenderPosition} from './utils.js';

import TripInfoComponent from './components/tripinfo.js';
import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filter.js';
import EventComponent from './components/event-template.js';
import DayListComponent from './components/daylist.js';
import DayComponent from './components/day.js';

import {createAddEventFormTemplate} from './components/addform.js';
// import {createEventTemplate} from './components/event-template';

import {generateEvents} from './mocks/event.js';
import {generateFilters} from './mocks/filters.js';

const EVENTS_COUNT = 3;


// const render = (container, template, position = `beforeend`) => {
//   container.insertAdjacentHTML(position, template);
// };

// const createEvents = (array, createTemplate) => {
//   return `${array.map((elem) => createTemplate(elem).getElement()).join(`\n`)}`;
// };

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

    // const eventTemplate = createEvents(eventsOnDay, new EventComponent());
    // const day = createDayTemplate(index + 1, date, eventTemplate);
    const day = new DayComponent(index + 1, date).getElement();
    const eventsList = day.querySelector(`.trip-events__list`);
    eventsOnDay.map((event) => {
      renderElement(eventsList, new EventComponent(event).getElement(), RenderPosition.BEFOREEND);
    });
    // render(container, day);
    renderElement(container, day, RenderPosition.BEFOREEND);
    // const eventElement = eventsOnDay.map((event) => {
    //   // console.log(event);
    //   return new EventComponent(event);
    // });
    // console.log(typeof eventElement);
  });
  // render(document.querySelector(`.trip-events__item`), createAddEventFormTemplate(events[0]), `afterbegin`);
};

const events = generateEvents(EVENTS_COUNT).sort((a, b) => a.startDate - b.startDate);
const filters = generateFilters();

const tripInfoContainer = document.querySelector(`.trip-info`);

const tripInfoComponent = new TripInfoComponent(events);
const menuComponent = new MenuComponent();
const filtersComponent = new FiltersComponent(filters);
// const dayComponent = new DayComponent()

renderElement(tripInfoContainer, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);

const tripControls = document.querySelector(`.trip-controls`);
// const tripMenuTitle = tripControls.firstElementChild;
// const tripFiltersTitle = tripControls.lastElementChild;
// render(tripMenuTitle, createMenuTemplate(), `afterend`);
renderElement(tripControls, menuComponent.getElement(), RenderPosition.AFTERBEGIN); // подумать как засунуть под h2
renderElement(tripControls, filtersComponent.getElement(), RenderPosition.BEFOREEND);

const eventsContainer = document.querySelector(`.trip-events`);
// render(eventsContainer, createDayListTemplate());
renderElement(eventsContainer, new DayListComponent().getElement(), RenderPosition.BEFOREEND);
const dayList = eventsContainer.querySelector(`.trip-days`);

renderEvents(dayList, events);
