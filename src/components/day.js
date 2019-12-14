import {MonthNames} from '../constants.js';

const createDayTemplate = (count, date, events) => {
  date = new Date(date);
  const month = MonthNames[date.getMonth() + 1];
  const day = date.getDate();
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count}</span>
        <time class="day__date" datetime="2019-03-18">${month} ${day}</time>
      </div>
      <ul class="trip-events__list">${events}</ul>
    </li>`
  );
};

export {createDayTemplate};
