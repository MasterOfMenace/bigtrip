import moment from 'moment';

export const getBoolean = () => {
  return Math.random() > 0.5;
};
export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomValue = (array) => {
  return array[getRandomNumber(0, array.length - 1)];
};

export const getDuration = (start, end) => {
  start = moment(start);
  end = moment(end);
  const duration = moment.duration(end.diff(start));

  const days = duration.get(`days`);
  const hours = duration.get(`hours`);
  const minutes = duration.get(`minutes`);
  const daysFormatted = days <= 0 ? `` : `${days < 10 ? `0${days}D` : `${days}D`}`;
  const hoursFormatted = hours <= 0 ? `` : `${hours < 10 ? `0${hours}H` : `${hours}H`}`;
  const minutesFormatted = minutes <= 0 ? `` : `${minutes < 10 ? `0${minutes}M` : `${minutes}M`}`;

  return `${daysFormatted} ${hoursFormatted} ${minutesFormatted}`;
}
;

export const formatTime = (time) => {
  return moment(time).format(`HH:mm`);
};
