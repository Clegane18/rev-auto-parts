const getMonthStartAndEnd = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);

  const end = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  return { start, end };
};

module.exports = { getMonthStartAndEnd };
