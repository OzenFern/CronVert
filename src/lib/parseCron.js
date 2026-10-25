import parseField from "./parseField.js";

/**
 * Splits the provided cron into 5 fields. Handles multiple whitespaces. Returns error object if number of fields are not equal to 5
 * @param cron The cron to split into 5 fields
 * @return {{success: boolean, error: {message: string}}}
 */
const splitCron = (cron) => {
  const fields = cron.replace(/\s+/g, " ").trim().split(" ");

  if (fields.length > 5) {
    return {
      success: false,
      error: {
        message: "more than 5 fields",
      },
    };
  }

  if (fields.length < 5) {
    return {
      success: false,
      error: {
        message: "fewer than 5 fields",
      },
    };
  }

  return {
    success: true,
    value: fields,
  };
};

/**
 * Parses and also validates minute field from cron
 * @param minute The minute field of cron
 * @return {{success: boolean, value: {type: string, value: number}|{type: string, start: (number|null), end: (number|null), step: number}|{type: string, value: Array}|{type: string, start: number, end: number}|*}|{success: boolean, error: {message: string, description: string|string}}}
 */
const parseMinute = (minute) => {
  const result = parseField(minute, 0, 59);
  if (!result.success) {
    return {
      success: false,
      error: {
        message: "invalid minute value",
        description: result.error,
      },
    };
  }

  return {
    success: true,
    value: result.value,
  };
};

/**
 * Parses and also validates hour field from cron
 * @param hour The hour field of cron
 * @return {{success: boolean, value: {type: string, value: number}|{type: string, start: (number|null), end: (number|null), step: number}|{type: string, value: Array}|{type: string, start: number, end: number}|*}|{success: boolean, error: {message: string, description: string|string}}}
 */
const parseHour = (hour) => {
  const result = parseField(hour, 0, 23);
  if (!result.success) {
    return {
      success: false,
      error: {
        message: "invalid hour value",
        description: result.error,
      },
    };
  }

  return {
    success: true,
    value: result.value,
  };
};

/**
 * Parses and also validates day-of-month field from cron
 * @param dayOfMonth The day-of-month field of cron
 * @return {{success: boolean, value: {type: string, value: number}|{type: string, start: (number|null), end: (number|null), step: number}|{type: string, value: Array}|{type: string, start: number, end: number}|*}|{success: boolean, error: {message: string, description: string|string}}}
 */
const parseDayOfMonth = (dayOfMonth) => {
  const result = parseField(dayOfMonth, 1, 31);
  if (!result.success) {
    return {
      success: false,
      error: {
        message: "invalid day-of-month value",
        description: result.error,
      },
    };
  }

  return {
    success: true,
    value: result.value,
  };
};

/**
 * Parses and also validates month field from cron
 * @param month The month field of cron
 * @return {{success: boolean, value: {type: string, value: number}|{type: string, start: (number|null), end: (number|null), step: number}|{type: string, value: Array}|{type: string, start: number, end: number}|*}|{success: boolean, error: {message: string, description: string|string}}}
 */
const parseMonth = (month) => {
  const result = parseField(month, 1, 12);
  if (!result.success) {
    return {
      success: false,
      error: {
        message: "invalid month value",
        description: result.error,
      },
    };
  }

  return {
    success: true,
    value: result.value,
  };
};

/**
 * Parses and also validates day-of-week field for cron
 * @param dayOfWeek The day-of-week field of cron
 * @return {{success: boolean, value: {type: string, value: number}|{type: string, start: (number|null), end: (number|null), step: number}|{type: string, value: Array}|{type: string, start: number, end: number}|*}|{success: boolean, error: {message: string, description: string|string}}}
 */
const parseDayOfWeek = (dayOfWeek) => {
  const result = parseField(dayOfWeek, 0, 7);
  if (!result.success) {
    return {
      success: false,
      error: {
        message: "invalid day-of-week value",
        description: result.error,
      },
    };
  }

  return {
    success: true,
    value: result.value,
  };
};

/**
 * Parses the entire cron expression and breaks it down into minute, hour, dayOfMonth, month & dayOfWeek. Handles invalid cron by returning meaningful errors
 * @param cron The cron expression to parse
 * @return {{success: boolean, error: string}|Array|*|{success: boolean, value: {minute: *, hour: *, dayOfMonth: *, month: *, dayOfWeek: *}}}
 */
const parseCron = (cron) => {
  const fields = splitCron(cron);

  if (!fields.success) {
    return fields;
  }

  let [minute, hour, dayOfMonth, month, dayOfWeek] = fields.value;

  minute = parseMinute(minute);
  if (!minute.success) {
    return minute;
  }

  hour = parseHour(hour);
  if (!hour.success) {
    return hour;
  }

  dayOfMonth = parseDayOfMonth(dayOfMonth);
  if (!dayOfMonth.success) {
    return dayOfMonth;
  }

  month = parseMonth(month);
  if (!month.success) {
    return month;
  }

  dayOfWeek = parseDayOfWeek(dayOfWeek);
  if (!dayOfWeek.success) {
    return dayOfWeek;
  }

  return {
    success: true,
    value: {
      minute: minute.value,
      hour: hour.value,
      dayOfMonth: dayOfMonth.value,
      month: month.value,
      dayOfWeek: dayOfWeek.value,
    },
  };
};

export default parseCron;
