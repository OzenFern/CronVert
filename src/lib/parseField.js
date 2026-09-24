/**
 * Returns the exact value of field while also checking for constraint violation of type and range
 * @param field - The value of the field to parse
 * @param min - The minimum value the field can take
 * @param max - The maximum value the field can take
 * @return {{success: boolean, error: string}|{success: boolean, value: {type: string, value: number}}}
 */
const parseExact = (field, min, max) => {
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
 * Parses the values separated by a list, validates them and returns all the values a array
 * @param field - The value of the field to parse
 * @param min - The minimum value the field can take
 * @param max - The maximum value the field can take
 * @return {{success: boolean, error: string}|{success: boolean, value: {type: string, value: array}}}
 */
const parseList = (field, min, max) => {
  if (!/^\d+(,\d+)+$/.test(field)) {
    return {
      success: false,
      error: "malformed syntax",
    };
  }

  // Spilt the string and validate each one
  const values = [];
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
 * @return {{success: boolean, error: string}|{success: boolean, value: {type: string, start: number, end: number}}}
 */
const parseRange = (field, min, max) => {
  if (!/^\d+-\d+$/.test(field)) {
    return {
      success: false,
      error: "malformed syntax",
    };
  }

  const values = [];
  for (const value of field.split("-")) {
    const result = parseExact(value, min, max);
    if (!result.success) {
      return result;
    }

    values.push(result.value.value);
  }

  const [start, end] = values;

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
 * @return {{success: boolean, error: string}|{success: boolean, value: {type: string, start: number|null, end: number|null, step:number}}}
 */
const parseStep = (field, min, max) => {
  if (!/^(?:\*|\d+-\d+)\/\d+$/.test(field)) {
    return {
      success: false,
      error: "malformed syntax",
    };
  }

  const [base, step] = field.split("/");

  // The step should always be a positive integer
  const result = parseExact(step, 1, max);
  if (!result.success) {
    return result;
  }
  // Prepare a return object with value of step
  const returnObj = {
    success: true,
    value: {
      type: "step",
      start: null,
      end: null,
      step: result.value.value,
    },
  };

  if (base === "*") {
    return returnObj;
  }

  const range = parseRange(base, min, max);
  if (!range.success) {
    return range;
  }

  const { start, end } = range.value;
  return { ...returnObj, value: { ...returnObj.value, start, end } };
};

/**
 * Parses the field and returns a structured object containing type and value of the field
 * @param field - The value of the field to parse
 * @param min - The minimum value the field can take
 * @param max - The maximum value the field can take
 */
const parseField = (field, min, max) => {
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
    return parseRange(field, min, max);
  }

  // Return as error object for non - numeric field
  return {
    success: false,
    error: "non-numeric value",
  };
};

export default parseField;
