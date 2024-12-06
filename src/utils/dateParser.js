const moment = require("moment-timezone");

const parseDate = (date = null) => {
  const dateToParse = date || moment().format("YYYY-MM-DD");

  const parsedDate = moment.tz(dateToParse, "Asia/Singapore");

  if (!parsedDate.isValid()) {
    console.error("Invalid date format:", dateToParse);
    return null;
  }

  const startOfDay = parsedDate.startOf("day").toDate();
  const endOfDay = parsedDate.endOf("day").toDate();

  return { startOfDay, endOfDay };
};

module.exports = parseDate;
