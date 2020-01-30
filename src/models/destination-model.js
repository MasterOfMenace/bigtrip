export default class DestinationModel {
  constructor(data) {
    this.description = data[`description`];
    this.name = data[`name`];
    this.pictures = Array.from(data[`pictures`]);
  }

  static parseDestination(data) {
    return new DestinationModel(data);
  }

  static parseDestinations(data) {
    return data.map(DestinationModel.parseDestination);
  }
}
