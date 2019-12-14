import {createMenuTemplate} from './components/menu.js';
import {createFiltersTemplate} from './components/filter.js';
import {createTripInfoTemplate} from './components/tripinfo.js';
import {createAddEventFormTemplate} from './components/addform.js';
import {createDayListTemplate} from './components/daylist.js';
import {createDayTemplate} from './components/day.js';
import {createEventTemplate} from './components/event-template';

import {generateEvents} from './mocks/event.js';
import {generateFilters} from './mocks/filters.js';

const EVENTS_COUNT = 3;


const render = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const renderEvents = (container, events) => {
  const dates = new Set();
  events.forEach((event) => {
    const eventDate = new Date(event.startDate);
    const eventDateFormatted = `${eventDate.getFullYear()}/${eventDate.getMonth()}/${eventDate.getDate()}`;
    dates.add(eventDateFormatted);
  });

  const createEvents = (array, createTemplate) => {
    return `${array.map((elem) => createTemplate(elem)).join(`\n`)}`;
  };

  Array.from(dates).forEach((date, index) => {
    const event = events.filter((ev) => {
      const eventDate = new Date(ev.startDate);
      const eventDateFormatted = `${eventDate.getFullYear()}/${eventDate.getMonth()}/${eventDate.getDate()}`;
      if (eventDateFormatted === date) {
        return ev;
      } else {
        return null;
      }
    });

    const eventTemplate = createEvents(event, createEventTemplate);
    const day = createDayTemplate(index + 1, date, eventTemplate);
    render(container, day);
  });
};

const events = generateEvents(EVENTS_COUNT).sort((a, b) => a.startDate - b.startDate);

const tripInfoContainer = document.querySelector(`.trip-info`);
render(tripInfoContainer, createTripInfoTemplate(events), `afterbegin`);

const tripControls = document.querySelector(`.trip-controls`);
const tripMenuTitle = tripControls.firstElementChild;
render(tripMenuTitle, createMenuTemplate(), `afterend`);

const tripFiltersTitle = tripControls.lastElementChild;
const filters = generateFilters();
render(tripFiltersTitle, createFiltersTemplate(filters), `afterend`);

const eventsContainer = document.querySelector(`.trip-events`);
render(eventsContainer, createDayListTemplate());
const dayList = eventsContainer.querySelector(`.trip-days`);
render(dayList, createAddEventFormTemplate(events[0])); // сюда отрендерить первый элемент из ивентов

renderEvents(dayList, events.slice(1));
