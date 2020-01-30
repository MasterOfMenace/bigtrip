import moment from 'moment';

export const getDuration = (event) => {
  const start = moment(event.dateFrom);
  const end = moment(event.dateTo);
  return moment.duration(end.diff(start));
};

export const formatTime = (time) => {
  return moment(time).format(`HH:mm`);
};
