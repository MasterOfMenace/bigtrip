import PointModel from '../models/point-model';
import DestinationModel from '../models/destination-model';
import OfferModel from '../models/offer-model';

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
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
    .then((data) => PointModel.parsePoints(data));
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

  _load({url, method, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
    .then(checkStatus)
    .catch((error) => {
      throw error;
    });
  }
}
