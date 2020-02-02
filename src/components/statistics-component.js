import AbstractSmartComponent from './abstract-smart-component';
import Chart from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';
import {EventTypes} from '../constants';
import {getDuration} from '../utils/utils';

const TRANSPORT_TYPES = EventTypes.transportGroup.map((it) => it.type);

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`
  );
};

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const calculateUniqueTransportCount = (types, type) => {
  return types.filter((it) => it === type).length;
};

const createTimeSpendChart = (ctx, events) => {
  const timeData = {};
  events.forEach((event) => {
    if (timeData[event.type]) {
      timeData[event.type] += Math.round(getDuration(event).as(`hours`));
    } else {
      timeData[event.type] = Math.round(getDuration(event).as(`hours`));
    }
  });

  return new Chart(ctx, {
    plugins: [chartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(timeData).map((it) => it.toUpperCase()),
      datasets: [{
        data: Object.values(timeData),
        backgroundColor: `#fff`,
        barThickness: 25,
        maxBarThickness: 25,
        minBarLength: 1,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          formatter(value) {
            return `${value} Hours`;
          },
          font: {
            size: 14
          },
          color: `#000000`,
          anchor: `end`,
          clamp: true,
          align: `start`
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: true,
            fontSize: 14,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      tooltips: {
        enabled: true,
      },
      layout: {
        padding: {
          top: 10
        }
      },
      title: {
        display: true,
        position: `left`,
        text: `TIME SPENT`,
        fontSize: 24,
        fontColor: `#000000`
      },
      legend: {
        display: false,
      }
    }
  });
};

const createTransportChart = (ctx, events) => {
  const currentEventTypes = events.map((it) => it.type);

  const uniqueTransportTypes = currentEventTypes.filter((it) => TRANSPORT_TYPES.includes(it)).filter(getUniqItems);

  const transportsCount = uniqueTransportTypes.map((type) => calculateUniqueTransportCount(currentEventTypes, type));

  return new Chart(ctx, {
    plugins: [chartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueTransportTypes.map((it) => it.toUpperCase()),
      datasets: [{
        data: transportsCount,
        backgroundColor: `#fff`,
        barThickness: 25,
        maxBarThickness: 25,
        minBarLength: 1,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          formatter(value) {
            return `x` + value;
          },
          font: {
            size: 14
          },
          color: `#000000`,
          anchor: `end`,
          clamp: true,
          align: `start`
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: true,
            fontSize: 14,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      tooltips: {
        enabled: true,
      },
      layout: {
        padding: {
          top: 10
        }
      },
      title: {
        display: true,
        position: `left`,
        text: `TRANSPORT`,
        fontSize: 24,
        fontColor: `#000000`
      },
      legend: {
        display: false,
      }
    }
  });
};

const createMoneyChart = (ctx, events) => {
  const moneyData = {};
  events.forEach((event) => {
    if (moneyData[event.type]) {
      moneyData[event.type] += event.basePrice;
    } else {
      moneyData[event.type] = event.basePrice;
    }
  });

  return new Chart(ctx, {
    plugins: [chartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(moneyData).map((it) => it.toUpperCase()),
      datasets: [{
        data: Object.values(moneyData),
        backgroundColor: `#fff`,
        barThickness: 25,
        maxBarThickness: 25,
        minBarLength: 1,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          formatter(value) {
            return `€` + value;
          },
          font: {
            size: 14
          },
          color: `#000000`,
          anchor: `end`,
          clamp: true,
          align: `start`
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: true,
            fontSize: 14,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      tooltips: {
        enabled: true,
      },
      layout: {
        padding: {
          top: 10
        }
      },
      title: {
        display: true,
        position: `left`,
        text: `MONEY`,
        fontSize: 24,
        fontColor: `#000000`
      },
      legend: {
        display: false,
      }
    }
  });
};

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor({events}) {
    super();

    this._events = events;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;
    this._renderCharts();
  }

  recoveryListeners() {

  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this.rerender(this._events);
  }

  rerender(events) {
    this._events = events;

    super.rerender();
    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);
    this._moneyChart = createMoneyChart(moneyCtx, this._events.getPoints());
    this._transportChart = createTransportChart(transportCtx, this._events.getPoints());
    this._timeSpendChart = createTimeSpendChart(timeSpendCtx, this._events.getPoints());
  }
}
