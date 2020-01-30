import {FilterType} from "../constants";

const getFutureEvents = (events, date) => {
  return events.filter((event) => {
    const startDate = new Date(event.dateFrom);
    return date < startDate;
  });
};

const getPastEvents = (events, date) => {
  return events.filter((event) => {
    const startDate = new Date(event.dateFrom);
    return date > startDate;
  });
};

export const getEventsByFilter = (events, filter) => {
  const now = Date.now();

  switch (filter) {
    case FilterType.ALL:
      return events;
    case FilterType.FUTURE:
      return getFutureEvents(events, now);
    case FilterType.PAST:
      return getPastEvents(events, now);
  }

  return events;
};
