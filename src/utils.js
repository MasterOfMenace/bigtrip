const getBoolean = () => {
  return Math.random() > 0.5;
};
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomValue = (array) => {
  return array[getRandomNumber(0, array.length - 1)];
};

const formatTime = (time) => {
  return time < 10 && time !== 0 ? `0${time}` : time;
};

const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;

  return element.firstChild;
};

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

const renderElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
  }
};

export {getBoolean, getRandomNumber, getRandomValue, formatTime, createElement, renderElement, RenderPosition};
