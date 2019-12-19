const filterNames = [`everything`, `future`, `past`];

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      name: it,
      title: it.toUpperCase(),
    };
  });
};

export {generateFilters};
