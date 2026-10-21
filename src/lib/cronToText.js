import parseCron from "./parseCron.js";
import formatCron from "./formatCron.js";

/**
 * Converts cron into meaningful English text, and returns the answer as an object
 * @param cron
 * @return {{success: boolean, value: string}|{success: boolean, error: string}|Array|*|{success: boolean, value: {minute: *, hour: *, dayOfMonth: *, month: *, dayOfWeek: *}}}
 */
const cronToText = (cron) => {
  const parsed = parseCron(cron);

  if (!parsed.success) {
    return parsed;
  }

  return {
    success: true,
    value: formatCron(parsed.value),
  };
};

export default cronToText;
