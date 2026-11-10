import parseCron, { type Result } from "./parseCron.ts";
import formatCron from "./formatCron.ts";

/**
 * Converts cron into meaningful English text, and returns the answer as an object
 * @param cron
 * @return {Result<string>}
 */
const cronToText = (cron: string): Result<string> => {
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
