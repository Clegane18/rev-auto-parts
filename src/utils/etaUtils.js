const calculateETARange = (createdAt) => {
  const startDate = new Date(createdAt);
  startDate.setDate(startDate.getDate() + 3);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(createdAt);
  endDate.setDate(endDate.getDate() + 4);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateRange = (startDate, endDate) => {
  const optionsStart = { month: "long", day: "numeric" };
  const optionsEnd = { month: "long", day: "numeric", year: "numeric" };

  const startStr = startDate.toLocaleDateString("en-US", optionsStart);
  const endStr = endDate.toLocaleDateString("en-US", optionsEnd);

  return `${startStr} - ${endStr}`;
};

module.exports = {
  calculateETARange,
  formatDate,
  formatDateRange,
};
