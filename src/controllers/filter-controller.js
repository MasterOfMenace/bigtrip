import {FilterType} from "../constants";
import FilterComponent from '../components/filter';
import {replace, renderElement, RenderPosition} from "../utils/render";

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilter = FilterType.ALL;
    this._filterComponent = null;
    this._onFilterChange = this._onFilterChange.bind(this);
  }

  hide() {
    this._filterComponent.hide();
  }

  show() {
    this._filterComponent.show();
  }

  render() {
    const container = this._container;
    // const allPoints = this._pointsModel.getPointsAll();

    const filters = Object.values(FilterType).map((filter) => {
      return {
        name: filter,
        checked: filter === this._activeFilter
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      renderElement(container, this._filterComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filter) {
    this._pointsModel.setFilter(filter);
    this._activeFilter = filter;
  }
}
