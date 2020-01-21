import {renderElement, RenderPosition} from './utils/render';
import {generateEvents} from './mocks/event.js';
import TripInfoComponent from './components/tripinfo.js';
import MenuComponent, {MenuItem} from './components/menu.js';
import DayListComponent from './components/daylist.js';
import TripController from './controllers/trip-controller';
import PointsModel from './models/points-model';
import FilterController from './controllers/filter-controller';
import StatisticsComponent from './components/statistics';

const EVENTS_COUNT = 5;

const events = generateEvents(EVENTS_COUNT).sort((a, b) => a.startDate - b.startDate);
const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const pageMainContainer = document.querySelector(`.page-main`).querySelector(`.page-body__container`);

const tripInfoContainer = document.querySelector(`.trip-info`);

const tripInfoComponent = new TripInfoComponent(events);
const menuComponent = new MenuComponent();
const tripControls = document.querySelector(`.trip-controls`);
const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

renderElement(tripInfoContainer, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);

renderElement(tripControls, menuComponent.getElement(), RenderPosition.AFTERBEGIN); // подумать как засунуть под h2

const daysListComponent = new DayListComponent();
const tripController = new TripController(daysListComponent, pointsModel);
const dayList = daysListComponent.getElement();
const statisticsComponent = new StatisticsComponent();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  tripController.createPoint();
});

const eventsContainer = document.querySelector(`.trip-events`);
renderElement(eventsContainer, dayList, RenderPosition.BEFOREEND);
renderElement(pageMainContainer, statisticsComponent.getElement(), RenderPosition.BEFOREEND);

statisticsComponent.hide();
tripController.render();

menuComponent.setOnClick((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      menuComponent.setActiveItem(MenuItem.TABLE);
      statisticsComponent.hide();
      tripController.show();
      filterController.show();
      break;
    case MenuItem.STATISTIC:
      menuComponent.setActiveItem(MenuItem.STATISTIC);
      tripController.hide();
      filterController.hide();
      statisticsComponent.show();
      break;
  }
});
