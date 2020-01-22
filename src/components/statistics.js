import AbstractSmartComponent from "./abstract-smart-component";
import Chart from 'chart.js';
import chartDatalabels from 'chartjs-plugin-datalabels';

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

const createMoneyChart = (ctx, events) => {
  // const eventTypes = events.map((event) => event.type.type).filter(getUniqItems);
  const eventTypes = events.map((event) => event.type.type);
  const money = events.map((event) => event.price);
  console.log(eventTypes);
  console.log(money);

  return new Chart(ctx, {
    plugins: [chartDatalabels],
    type: `horizontalBar`,
    data: {
      labels: eventTypes,
      datasets: [{
        data: money,
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
          align: `end`,
          textAlign: `end`
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: true,
            fontSize: 18,
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
      title: {
        display: true,
        text: `DONE BY: COLORS`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
  // const list = eventTypes.map((type) => {
  //   return events.filter((event) => event.type.type === type);
  // });
  // console.log(list);

  // const cost = events.map((event) => {
  //   if (eventTypes.includes(event.type.type)) {
  //     return `${event.type.type} ${event.price}`;
  //   }
  // });
  // console.log(cost);
};

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor({events}) {
    super();

    this._events = events;

    this._moneyChart = null;
    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    this._moneyChart = createMoneyChart(moneyCtx, this._events.getPoints());
  }
}
