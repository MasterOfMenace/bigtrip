import PointModel from '../models/point-model';
import DestinationModel from '../models/destination-model';
import OfferModel from '../models/offer-model';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const ResponseStatus = {
  OK: 200,
  MULTIPLE_CHOISE: 300,
};

const checkStatus = (response) => {
  if (response.status >= ResponseStatus.OK && response.status < ResponseStatus.MULTIPLE_CHOISE) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
    .then((response) => response.json())
    .then((data) => {
      return PointModel.parsePoints(data);
    });
  }

  getDestinations() {
    return this._load({url: `destinations`})
    .then((response) => response.json())
    .then((data) => DestinationModel.parseDestinations(data));
  }

  getOffers() {
    return this._load({url: `offers`})
    .then((response) => response.json())
    .then((data) => OfferModel.parseOffers(data));
  }

  updatePoint(id, data) {
    return this._load({url: `points/${id}`, method: Method.PUT, body: JSON.stringify(data.toRAW()), headers: new Headers({'Content-Type': `application/json`})})
    .then((response) => response.json())
    .then((point) => {
      return PointModel.parsePoint(point);
    });
  }

  createPoint(data) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then((point) => {
        return PointModel.parsePoint(point);
      });
  }

  deletePoint(id) {
    return this._load({
      url: `points/${id}`,
      method: Method.DELETE
    });
  }

  _load({url, method, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
    .then(checkStatus)
    .catch((error) => {
      throw error;
    });
  }
}
