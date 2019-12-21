import {renderElement, RenderPosition} from './utils/render';
import {generateEvents} from './mocks/event.js';
import {generateFilters} from './mocks/filters.js';
import TripInfoComponent from './components/tripinfo.js';
import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filter.js';
import DayListComponent from './components/daylist.js';
import TripController from './controllers/trip-controller';

const EVENTS_COUNT = 5;

const events = generateEvents(EVENTS_COUNT).sort((a, b) => a.startDate - b.startDate);
const filters = generateFilters();

const tripInfoContainer = document.querySelector(`.trip-info`);

const tripInfoComponent = new TripInfoComponent(events);
const menuComponent = new MenuComponent();
const filtersComponent = new FiltersComponent(filters);

renderElement(tripInfoContainer, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);

const tripControls = document.querySelector(`.trip-controls`);
renderElement(tripControls, menuComponent.getElement(), RenderPosition.AFTERBEGIN); // подумать как засунуть под h2
renderElement(tripControls, filtersComponent.getElement(), RenderPosition.BEFOREEND);

const daysListComponent = new DayListComponent();
const tripController = new TripController(daysListComponent);
const dayList = daysListComponent.getElement();

const eventsContainer = document.querySelector(`.trip-events`);
renderElement(eventsContainer, dayList, RenderPosition.BEFOREEND);

tripController.render(events);
