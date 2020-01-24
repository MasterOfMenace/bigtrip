export default class OfferModel {
  constructor(data) {
    this.type = data[`type`];
    this.offers = Array.from(data[`offers`]);
    /*
    {
  "type": "taxi",
  "offers": [
    {
      "title": "Upgrade to a business class",
      "price": 120
    }, {
      "title": "Choose the radio station",
      "price": 60
    }
  ]
} */
  }

  static parseOffer(data) {
    return new OfferModel(data);
  }

  static parseOffers(data) {
    return data.map(OfferModel.parseOffer);
  }
}
