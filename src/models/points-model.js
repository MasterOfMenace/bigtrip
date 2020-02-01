import {FilterType} from '../constants';
import {getEventsByFilter} from '../utils/filter';

export default class PointsModel {
  constructor() {
    this._points = [];

    this._destinations = [];
    this._offers = [];
    this._activeFilter = FilterType.ALL;
    this._filterChangeHandlers = [];
  }

  getPoints() {
    return getEventsByFilter(this._points, this._activeFilter);
  }

  getPointsAll() {
    return this._points;
  }

  getDestinations() {
    return this._destinations;
  }

  getOffers() {
    return this._offers;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setPoints(events) {
    this._points = events;
  }

  setFilter(filter) {
    this._activeFilter = filter;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updatePoint(id, event) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), event, this._points.slice(index + 1));

    return true;
  }

  addPoint(event) {
    this._points = [].concat(event, this._points);
  }

  removePoint(id) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }
}
