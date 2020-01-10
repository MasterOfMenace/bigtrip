const MonthNames = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOW`, `DEC`];

const FilterType = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const EventTypes = {
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

const EventTypesGroups = {
  transportGroup: `Transfer`,
  activityGroup: `Activity`,
};

const Offers = [
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

export {MonthNames, Offers, EventTypes, EventTypesGroups, FilterType};
