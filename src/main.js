import Api from '../src/api/api';
import {renderElement, RenderPosition} from './utils/render';
import TripInfoComponent from './components/tripinfo.js';
import MenuComponent, {MenuItem} from './components/menu.js';
import DayListComponent from './components/daylist.js';
import TripController from './controllers/trip-controller';
import PointsModel from './models/points-model';
import FilterController from './controllers/filter-controller';
import StatisticsComponent from './components/statistics';

const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;
const AUTHORIZATION = `Basic dfo0w590ik298564a`;

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();

const pageMain = document.querySelector(`.page-main`);

const tripInfoContainer = document.querySelector(`.trip-main`);

const menuComponent = new MenuComponent();
const tripControls = document.querySelector(`.trip-controls`);
const tripInfoComponent = new TripInfoComponent();

const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

renderElement(tripControls, menuComponent.getElement(), RenderPosition.AFTERBEGIN); // подумать как засунуть под h2

const daysListComponent = new DayListComponent();
const tripController = new TripController(daysListComponent, pointsModel, api, tripInfoComponent);
const dayList = daysListComponent.getElement();
const statisticsComponent = new StatisticsComponent({events: pointsModel});

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  tripController.createPoint();
});

const eventsContainer = document.querySelector(`.trip-events`);
renderElement(eventsContainer, dayList, RenderPosition.BEFOREEND);
renderElement(pageMain, statisticsComponent.getElement(), RenderPosition.BEFOREEND);

statisticsComponent.hide();
// tripController.render();

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

api.getPoints()
  .then((points) => {
    tripInfoComponent.setEvents(points);
    renderElement(tripInfoContainer, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);
    pointsModel.setPoints(points);
  })
  .then(() => api.getDestinations())
  .then((destinations) => pointsModel.setDestinations(destinations))
  .then(() => api.getOffers())
  .then((offers) => {
    pointsModel.setOffers(offers);
    tripController.render();
  });
