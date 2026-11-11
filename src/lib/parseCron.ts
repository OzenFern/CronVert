import parseField, { type CronField } from "./parseField.ts";

type FieldName = "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek";

type FieldError = {
  message: string;
  description?: string;
};

type Result<T> =
  | { success: true; value: T }
  | {
      success: false;
      error: FieldError;
    };

type CronObject = Record<FieldName, CronField>;

type Field = { key: FieldName; label: string; min: number; max: number };

const FIELDS = [
  { key: "minute", label: "minute", min: 0, max: 59 },
  { key: "hour", label: "hour", min: 0, max: 23 },
  { key: "dayOfMonth", label: "day-of-month", min: 1, max: 31 },
  { key: "month", label: "month", min: 1, max: 12 },
  { key: "dayOfWeek", label: "day-of-week", min: 0, max: 7 },
] as const satisfies readonly Field[];

/**
 * Splits the provided cron into 5 fields. Handles multiple whitespaces. Returns error object if number of fields are not equal to 5
 * @param cron The cron to split into 5 fields
 * @return {Result<string[]>}
 */
const splitCron = (cron: string): Result<string[]> => {
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
 * Parses the entire cron expression and breaks it down into minute, hour, dayOfMonth, month & dayOfWeek. Handles invalid cron by returning meaningful errors
 * @param cron The cron expression to parse
 * @return {CronObject}
 */
const parseCron = (cron: string): Result<CronObject> => {
  const parts = splitCron(cron);

  if (!parts.success) {
    return parts;
  }

  const out = {} as CronObject;

  for (const [i, field] of FIELDS.entries()) {
    const result = parseField(parts.value[i], field.min, field.max);

    if (!result.success) {
      return {
        success: false,
        error: {
          message: `invalid ${field.label} value`,
          description: result.error,
        },
      };
    }

    out[field.key] = result.value;
  }

  return {
    success: true,
    value: out,
  };
};

export default parseCron;
export type { CronObject, Result };
