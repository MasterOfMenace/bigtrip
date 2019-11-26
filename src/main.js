const EVENTS_COUNT = 3;

import {createMenuTemplate} from './components/menu.js';
import {createFiltersTemplate} from './components/filter.js';
import {createTripInfoTemplate} from './components/tripinfo.js';
import {createAddEventFormTemplate} from './components/addform.js';
import {createDayListTemplate} from './components/daylist.js';
import {createDayTemplate} from './components/day.js';
import {createEventTemplate} from './components/event.js';

const render = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const renderEvents = (container, count) => {
  for (let i = 0; i < count; i++) {
    render(container, createEventTemplate());
  }
};

const tripInfoContainer = document.querySelector(`.trip-info`);
render(tripInfoContainer, createTripInfoTemplate(), `afterbegin`);

const tripControls = document.querySelector(`.trip-controls`);
const tripMenuTitle = tripControls.firstElementChild;
render(tripMenuTitle, createMenuTemplate(), `afterend`);

const tripFiltersTitle = tripControls.lastElementChild;
render(tripFiltersTitle, createFiltersTemplate(), `afterend`);

const eventsContainer = document.querySelector(`.trip-events`);
const eventsContainerTitle = eventsContainer.firstElementChild;
render(eventsContainerTitle, createAddEventFormTemplate(), `afterend`);
render(eventsContainer, createDayListTemplate());

const dayList = eventsContainer.querySelector(`.trip-days`);
render(dayList, createDayTemplate());

const eventsList = dayList.querySelector(`.trip-events__list`);
renderEvents(eventsList, EVENTS_COUNT);
