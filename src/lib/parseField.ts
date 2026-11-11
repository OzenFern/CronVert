type ParseSuccess<T> = {
  success: true;
  value: T;
};

type ParseError = {
  success: false;
  error: string;
};

type ParseResult<T extends CronField> = ParseSuccess<T> | ParseError;

type Exact = {
  type: "exact";
  value: number;
};

type List = {
  type: "list";
  values: number[];
};

type Range = {
  type: "range";
  start: number;
  end: number;
};

type Step = {
  type: "step";
  start: null | number;
  end: null | number;
  step: number;
};

type Any = { type: "any" };

type CronField = Any | Exact | List | Step | Range;

/**
 * Returns the exact value of field while also checking for constraint violation of type and range
 * @param field - The value of the field to parse
 * @param min - The minimum value the field can take
 * @param max - The maximum value the field can take
 * @return {ParseResult<Exact>}
 */
const parseExact = (field: string, min: number, max: number): ParseResult<Exact> => {
  // Strictly check for integers in the field
  if (!/^-?\d+$/.test(field)) {
    return {
      success: false,
      error: "non-numeric value",
    };
  }

  const value = Number(field);

  if (value > max) {
    return {
      success: false,
      error: "value exceeds maximum",
    };
  }

  if (value < min) {
    return {
      success: false,
      error: "value below minimum",
    };
  }

  return {
    success: true,
    value: {
      type: "exact",
      value,
    },
  };
};

/**
 * Parses the values separated by a list, validates them and returns all the values an array
 * @param field - The value of the field to parse
 * @param min - The minimum value the field can take
 * @param max - The maximum value the field can take
 * @return {ParseResult<List>}
 */
const parseList = (field: string, min: number, max: number): ParseResult<List> => {
  if (!/^\d+(,\d+)+$/.test(field)) {
    return {
      success: false,
      error: "malformed syntax",
    };
  }

  // Spilt the string and validate each one
  const values: number[] = [];
  for (const value of field.split(",")) {
    const result = parseExact(value, min, max);
    if (!result.success) {
      return result;
    }
    // Add the numeric value to the values array
    values.push(result.value.value);
  }

  // Return a valid list
  return {
    success: true,
    value: {
      type: "list",
      values,
    },
  };
};

/**
 * Parses the values in the range, also performs validation on them
 * @param field - The value of the field to parse
 * @param min - The minimum value the field can take
 * @param max - The maximum value the field can take
 * @return {ParseResult<Range>}
 */
const parseRange = (field: string, min: number, max: number): ParseResult<Range> => {
  if (!/^\d+-\d+$/.test(field)) {
    return {
      success: false,
      error: "malformed syntax",
    };
  }

  const values: number[] = [];
  for (const value of field.split("-")) {
    const result = parseExact(value, min, max);
    if (!result.success) {
      return result;
    }

    values.push(result.value.value);
  }

  const [start, end] = values;

  // If start is greater than end, return an error
  if (start > end) {
    return {
      success: false,
      error: "start value cannot be greater than end",
    };
  }

  return {
    success: true,
    value: {
      type: "range",
      start,
      end,
    },
  };
};

/**
 * Parses and validates the value of field for step with range
 * @param field - The value of the field to parse
 * @param min - The minimum value the field can take
 * @param max - The maximum value the field can take
 * @return {ParseResult<Step>}
 */
const parseStep = (field: string, min: number, max: number): ParseResult<Step> => {
  if (!/^(?:\*|\d+-\d+)\/\d+$/.test(field)) {
    return {
      success: false,
      error: "malformed syntax",
    };
  }

  const [base, rawStep] = field.split("/");

  // The step should always be a positive integer
  const result = parseExact(rawStep, 1, max);
  if (!result.success) {
    return result;
  }

  const step = result.value.value;

  if (base === "*") {
    return {
      success: true,
      value: {
        type: "step",
        start: null,
        end: null,
        step,
      },
    };
  }

  const range = parseRange(base, min, max);
  if (!range.success) {
    return range;
  }

  const { start, end } = range.value;
  return {
    success: true,
    value: {
      type: "step",
      start,
      end,
      step,
    },
  };
};

/**
 * Parses the field and returns a structured object containing type and value of the field
 * @param field - The value of the field to parse
 * @param min - The minimum value the field can take
 * @param max - The maximum value the field can take
 */
const parseField = (field: string, min: number, max: number): ParseResult<CronField> => {
  //   Check if the field is any wildcard
  if (field === "*") {
    return { success: true, value: { type: "any" } };
  }

  // Checks for negative and numeric field
  if (/^-?\d+$/.test(field)) {
    return parseExact(field, min, max);
  }

  // Check if field is a step
  if (field.includes("/")) {
    return parseStep(field, min, max);
  }

  //   Check if field is a list
  if (field.includes(",")) {
    return parseList(field, min, max);
  }

  //   Check if field is a range
  if (field.includes("-")) {
    const result = parseRange(field, min, max);

    if (!result.success) {
      return result;
    }

    const { start, end } = result.value;

    if (start === end) {
      return {
        success: true,
        value: {
          type: "exact",
          value: start,
        },
      };
    }

    return result;
  }

  // Return as error object for non - numeric field
  return {
    success: false,
    error: "non-numeric value",
  };
};

export default parseField;
export type { CronField };
