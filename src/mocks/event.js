import {getBoolean, getRandomValue, getRandomNumber} from '../utils.js';
import {Offers} from '../constants.js';

const EventTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];

const Cities = [`Amsterdam`, `Moscow`, `London`, `Bangkok`, `Vladivostok`, `Los Angeles`, `San Francisco`, `New York`, `New Vasuki`];

const DescriptionItems = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`];

const createDescription = (items) => {
  const count = getRandomNumber(1, 3);
  const description = [];
  for (let i = 0; i <= count; i++) {
    description.push(getRandomValue(items));
  }
  return description;
};


const generateOffers = (offers) => {
  return offers.filter(() => getBoolean()).slice(0, 2);
};

const generateShowplaces = () => {
  const generateURL = () => `http://picsum.photos/300/150?r=${Math.random()}`;
  const count = getRandomNumber(0, 4);
  return new Array(count).fill(``).map(generateURL);
};

const createStartDate = () => {
  const millisecondsOnDay = 86400000;
  const date = Date.now();
  const sign = getBoolean() ? 1 : -1;
  const diff = sign * getRandomNumber(0, 7 * millisecondsOnDay);
  return date + diff;
};


const createEvent = () => {
  const dates = Array(2).fill(``).map(createStartDate).sort((a, b) => a - b);

  return {
    type: getRandomValue(EventTypes),
    city: getRandomValue(Cities),
    offers: new Set(generateOffers(Offers)),
    description: createDescription(DescriptionItems),
    showplaces: generateShowplaces(),
    startDate: dates[0],
    endDate: dates[1],
    duration: dates[1] - dates[0],
    price: getRandomNumber(0, 1000),
  };
};

const generateEvents = (count) => {
  return new Array(count).fill(``).map(createEvent);
};

export {generateEvents};
