import AbstractComponent from "./abstract-component";

const createDayListTemplate = () => `<ul class="trip-days"></ul>`;

export default class DayListComponent extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createDayListTemplate();
  }
}
