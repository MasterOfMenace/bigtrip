export const MonthNames = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOW`, `DEC`];

export const FilterType = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

export const ViewMode = {
  ADD: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};

export const EmptyEvent = {
  type: `taxi`,
  destination: ``,
  offers: [
    {
      title: `Choose temperature`,
      price: 180
    }, {
      title: `Upgrade to a business class`,
      price: 50
    }
  ],
  dateFrom: `2019-07-10T22:55:56.845Z`,
  dateTo: `2019-07-11T11:22:13.375Z`,
  basePrice: 222,
  isFavorite: false,
};

export const EventTypes = {
  transportGroup: [
    {
      type: `taxi`,
      description: `Taxi to`
    },
    {
      type: `bus`,
      description: `Bus to`
    },
    {
      type: `train`,
      description: `Train to`
    },
    {
      type: `ship`,
      description: `Ship to`
    },
    {
      type: `transport`,
      description: `Transport to`
    },
    {
      type: `flight`,
      description: `Flight to`
    },
    {
      type: `drive`,
      description: `Drive to`
    },
  ],
  activityGroup: [
    {
      type: `check-in`,
      description: `Check-in into a hotel at`
    },
    {
      type: `sightseeing`,
      description: `Sightseeing at`
    },
    {
      type: `restaurant`,
      description: `Restaurant at`
    },
  ]
};

export const EventTypesGroups = {
  transportGroup: `Transfer`,
  activityGroup: `Activity`,
};
