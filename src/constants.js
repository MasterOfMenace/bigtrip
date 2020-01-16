export const MonthNames = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOW`, `DEC`];

export const FilterType = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const ViewMode = {
  ADD: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};

export const EmptyEvent = {
  type: {
    type: `taxi`,
    description: `Taxi to`
  },
  city: ``,
  offers: [],
  description: [],
  showplaces: [],
  startDate: null,
  endDate: null,
  duration: null,
  price: ``,
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

export const Offers = [
  {
    type: `luggage`,
    name: `Add luggage`,
    price: 10,
  },
  {
    type: `comfort`,
    name: `Switch to comfort class`,
    price: 150,
  },
  {
    type: `meal`,
    name: `Add meal`,
    price: 2,
  },
  {
    type: `seats`,
    name: `Choose seats`,
    price: 9,
  },
];
