import listJoin from "./utils/listFormat.js";
import formatSentence from "./utils/formatSentence.js";

/**
 * Month names indexed 1-12.
 * @type {string[]}
 */
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Weekday names indexed 0-6.
 * @type {string[]}
 */
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Converts a month number to its English name.
 * @param {number} monthNum
 * @returns {string}
 */
const getMonthName = (monthNum) => months[monthNum - 1];

/**
 * Converts a weekday number to its English name.
 * Both 0 and 7 represent Sunday.
 * @param {number} weekNum
 * @returns {string}
 */
const getWeekdayName = (weekNum) => weekdays[weekNum === 7 ? 0 : weekNum];

/**
 * Converts a number into its ordinal form.
 * @param {number} number
 * @returns {string}
 */
const formatOrdinal = (number) => {
  let suffix = "th";

  if (number % 100 < 11 || number % 100 > 13) {
    if (number % 10 === 1) {
      suffix = "st";
    } else if (number % 10 === 2) {
      suffix = "nd";
    } else if (number % 10 === 3) {
      suffix = "rd";
    }
  }

  return `${number}${suffix}`;
};

/**
 * Converts a 24-hour value to 12-hour format.
 * @param {number} hour
 * @returns {number}
 */
const formatHour = (hour) => {
  if (hour === 0) {
    return 12;
  }

  if (hour > 12) {
    return hour % 12;
  }

  return hour;
};

/**
 * Converts a 24-hour value to a readable hour with AM/PM.
 * @param {number} hour
 * @returns {string}
 */
const formatClockHour = (hour) => {
  const hourValue = formatHour(hour);
  const meridian = hour < 12 ? "AM" : "PM";

  return `${hourValue} ${meridian}`;
};

/**
 * Pads a minute value with a leading zero when minute has only one digit.
 * @param {number} minute
 * @returns {string}
 */
const formatMinute = (minute) => String(minute).padStart(2, "0");

/**
 * Returns the plural form of a field name.
 * @param {string} fieldName
 * @returns {string}
 */
const getPluralFieldName = (fieldName) => {
  const pluralNames = {
    minute: "minutes",
    hour: "hours",
    day: "days",
    month: "months",
    "day of week": "days of the week",
  };

  return pluralNames[fieldName] ?? `${fieldName}s`;
};

/**
 * Formats a field according to its parsed type.
 * @param {Object} field - The parsed field object containing type and value(s)
 * @param {string} fieldName - The name of the field (e.g., "minute", "hour", "day")
 * @param {Function} fn - Optional formatting function to apply to values
 * @returns {string}
 */
const formatField = (field, fieldName, fn = String) => {
  switch (field.type) {
    case "any":
      return "";

    case "exact":
      return fn(field.value);

    case "range":
      // Fix formatting of 0-7 in weekday
      // returning `Sunday through Sunday`
      const startFormatted = fn(field.start);
      const endFormatted = fn(field.end);
      if (startFormatted === endFormatted) {
        return startFormatted;
      }
      return `${startFormatted} through ${endFormatted}`;

    case "list":
      return listJoin(field.values.map((value) => fn(value)));

    case "step":
      return formatStep(field.start, field.end, field.step, fieldName, fn);

    default:
      return fieldName;
  }
};

/**
 * Formats a step expression.
 * @param {number|null} start - The starting value of the step range
 * @param {number|null} end - The ending value of the step range
 * @param {number} step - The step interval value
 * @param {string} fieldName - The name of the field being stepped over
 * @param {Function} fn - Optional formatting function to apply to start/end values
 * @returns {string}
 */
const formatStep = (start, end, step, fieldName, fn = String) => {
  const unit = step === 1 ? fieldName : getPluralFieldName(fieldName);

  // If the step is one, we omit out the value
  // Eg: 1 minute -> every minute
  let result = `every ${step === 1 ? "" : `${step} `}${unit}`;

  if (start !== null && end !== null) {
    result += ` from ${fn(start)} through ${fn(end)}`;
  }

  return result;
};

/**
 * Formats the minute and hour fields.
 * @param {Object} minute
 * @param {Object} hour
 * @returns {string}
 */
const formatTime = (minute, hour) => {
  // A specific hour and minute.
  if (minute.type === "exact" && hour.type === "exact") {
    const hourValue = formatClockHour(hour.value);

    if (minute.value === 0) {
      return `At ${hourValue}`;
    }

    // hourValue is formatted as hour + meridian, so split is used to add minute in between
    return `At ${hourValue.split(" ")[0]}:${formatMinute(minute.value)} ${hourValue.split(" ")[1]}`;
  }

  // Every minute, with no hour restriction.
  if (minute.type === "any" && hour.type === "any") {
    return "every minute";
  }

  // A specific minute of every hour.
  if (minute.type === "exact" && hour.type === "any") {
    if (minute.value === 0) {
      return "at the start of every hour";
    }

    return `at minute ${minute.value} of every hour`;
  }

  // Build hour description based on the hour field type:
  // - "any": applies to every hour
  // - "exact": a specific hour (e.g., "the 2 PM hour")
  // - other types (list, step, range): multiple hours (e.g., "hours 9 AM, 12 PM and 3 PM")
  const hourDescription =
    hour.type === "any"
      ? "every hour"
      : hour.type === "exact"
        ? `the ${formatClockHour(hour.value)} hour`
        : // For lists, steps, ranges and stepped-range hour values
          `hours ${formatField(hour, "hour", formatClockHour)}`;

  // Every minute during a particular hour or set of hours.
  if (minute.type === "any") {
    return `every minute during ${hourDescription}`;
  }

  // Every N minutes, when the hour is unrestricted.
  if (minute.type === "step" && hour.type === "any") {
    return formatField(minute, "minute");
  }

  // Other minute/hour combinations.
  const minuteDescription = formatField(minute, "minute");

  if (minute.type === "exact") {
    return `at minute ${minuteDescription} during ${hourDescription}`;
  }

  if (minute.type === "step") {
    return `${minuteDescription} during ${hourDescription}`;
  }

  // List of minutes
  return `at minutes ${minuteDescription} during ${hourDescription}`;
};

/**
 * Formats the day-of-month and month fields together.
 * @param {Object} dayOfMonth
 * @param {Object} month
 * @returns {string}
 */
const formatDate = (dayOfMonth, month) => {
  const hasDay = dayOfMonth.type !== "any";
  const hasMonth = month.type !== "any";

  // No date restrictions.
  if (!hasDay && !hasMonth) {
    return "";
  }

  const monthDescription = formatField(month, "month", getMonthName);

  // Every day within a particular month or set of months.
  if (!hasDay) {
    if (month.type === "step") {
      return `every day, ${monthDescription}`;
    }

    return `every day in ${monthDescription}`;
  }

  const dayDescription = formatField(dayOfMonth, "day", formatOrdinal);

  // A particular day, or set of days, every month.
  if (!hasMonth) {
    if (dayOfMonth.type === "step") {
      return `${dayDescription} of every month`;
    }

    return `on the ${dayDescription} of every month`;
  }

  // Both the day and month are restricted.
  if (dayOfMonth.type === "step") {
    return `${dayDescription} in ${monthDescription}`;
  }

  return `on the ${dayDescription} of ${monthDescription}`;
};

/**
 * Formats the day-of-week field.
 * @param {Object} week
 * @returns {string}
 */
const formatWeek = (week) => {
  if (week.type === "any") {
    return "";
  }

  return formatField(week, "day of week", getWeekdayName);
};

/**
 * Converts a parsed cron expression into readable English.
 * @param {Object} parsedCron
 * @returns {string}
 */
const formatCron = (parsedCron) => {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = parsedCron;

  // Special case: all fields are unrestricted.
  const fields = Object.values(parsedCron);

  if (fields.every((field) => field.type === "any")) {
    return formatSentence("every minute");
  }

  const time = formatTime(minute, hour);
  const date = formatDate(dayOfMonth, month);
  const week = formatWeek(dayOfWeek);

  // An exact time with no date or weekday restrictions runs every day.
  if (minute.type === "exact" && hour.type === "exact" && date === "" && week === "") {
    return formatSentence(`${time} every day`);
  }

  // Combine the phrases without adding punctuation to individual helpers.
  let result = time;

  if (date !== "") {
    result += ` ${date}`;
  }

  // Add weekday information with a comma separator if present
  if (week !== "") {
    result += `, ${week}`;
  }

  return formatSentence(result);
};

export default formatCron;
