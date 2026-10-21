import parseField from "./parseField.js";

describe("parseField", () => {
  describe("valid field types", () => {
    test("any (*)", () => {
      expect(parseField("*", 0, 59)).toEqual({
        success: true,
        value: {
          type: "any",
        },
      });
    });

    test("exact value", () => {
      expect(parseField("30", 0, 59)).toEqual({
        success: true,
        value: {
          type: "exact",
          value: 30,
        },
      });
    });

    test("range", () => {
      expect(parseField("1-5", 0, 59)).toEqual({
        success: true,
        value: {
          type: "range",
          start: 1,
          end: 5,
        },
      });
    });

    test("list", () => {
      expect(parseField("1,3,5", 0, 59)).toEqual({
        success: true,
        value: {
          type: "list",
          values: [1, 3, 5],
        },
      });
    });

    test("step", () => {
      expect(parseField("*/15", 0, 59)).toEqual({
        success: true,
        value: {
          type: "step",
          start: null,
          end: null,
          step: 15,
        },
      });
    });

    test("stepped range", () => {
      expect(parseField("1-10/2", 0, 59)).toEqual({
        success: true,
        value: {
          type: "step",
          start: 1,
          end: 10,
          step: 2,
        },
      });
    });
  });

  describe("invalid values", () => {
    test("value exceeds maximum", () => {
      expect(parseField("60", 0, 59)).toEqual({
        success: false,
        error: "value exceeds maximum",
      });
    });

    test("value below minimum", () => {
      expect(parseField("-1", 0, 59)).toEqual({
        success: false,
        error: "value below minimum",
      });
    });

    test("non-numeric value", () => {
      expect(parseField("abc", 0, 59)).toEqual({
        success: false,
        error: "non-numeric value",
      });
    });

    test("range exceeds maximum", () => {
      expect(parseField("1-60", 0, 59)).toEqual({
        success: false,
        error: "value exceeds maximum",
      });
    });
  });

  test("step having zero as the increment", () => {
    expect(parseField("*/0", 0, 59)).toEqual({
      success: false,
      error: "value below minimum",
    });
  });

  describe("malformed syntax", () => {
    test.each(["1-", "1--5", "1/"])("malformed syntax: %s", (field) => {
      expect(parseField(field, 0, 59)).toEqual({
        success: false,
        error: "malformed syntax",
      });
    });
  });

  describe("edge cases", () => {
    test("empty string", () => {
      expect(parseField("", 0, 59)).toEqual({
        success: false,
        error: "non-numeric value",
      });
    });

    test("whitespace only", () => {
      expect(parseField(" ", 0, 59)).toEqual({
        success: false,
        error: "non-numeric value",
      });
    });

    test("negative values", () => {
      expect(parseField("-5", 0, 59)).toEqual({
        success: false,
        error: "value below minimum",
      });
    });

    test("decimal values", () => {
      expect(parseField("1.5", 0, 59)).toEqual({
        success: false,
        error: "non-numeric value",
      });
    });

    test("zero value at minimum boundary", () => {
      expect(parseField("0", 0, 59)).toEqual({
        success: true,
        value: {
          type: "exact",
          value: 0,
        },
      });
    });

    test("value at maximum boundary", () => {
      expect(parseField("59", 0, 59)).toEqual({
        success: true,
        value: {
          type: "exact",
          value: 59,
        },
      });
    });

    test("range with start at minimum", () => {
      expect(parseField("0-10", 0, 59)).toEqual({
        success: true,
        value: {
          type: "range",
          start: 0,
          end: 10,
        },
      });
    });

    test("range with end at maximum", () => {
      expect(parseField("50-59", 0, 59)).toEqual({
        success: true,
        value: {
          type: "range",
          start: 50,
          end: 59,
        },
      });
    });

    test("list with single value is malformed", () => {
      expect(parseField("5", 0, 59)).toEqual({
        success: true,
        value: {
          type: "exact",
          value: 5,
        },
      });
    });

    test("list with duplicate values", () => {
      expect(parseField("1,1,2", 0, 59)).toEqual({
        success: true,
        value: {
          type: "list",
          values: [1, 1, 2],
        },
      });
    });

    test("list with values out of order", () => {
      expect(parseField("5,3,1", 0, 59)).toEqual({
        success: true,
        value: {
          type: "list",
          values: [5, 3, 1],
        },
      });
    });

    test("single-value range normalizes to exact value", () => {
      expect(parseField("1-1", 0, 59)).toEqual({
        success: true,
        value: {
          type: "exact",
          value: 1,
        },
      });
    });

    test("single-value range at minimum boundary normalizes to exact", () => {
      expect(parseField("0-0", 0, 59)).toEqual({
        success: true,
        value: {
          type: "exact",
          value: 0,
        },
      });
    });

    test("single-value range at maximum boundary normalizes to exact", () => {
      expect(parseField("59-59", 0, 59)).toEqual({
        success: true,
        value: {
          type: "exact",
          value: 59,
        },
      });
    });

    test("range where start equals end normalizes to exact value", () => {
      expect(parseField("5-5", 0, 59)).toEqual({
        success: true,
        value: {
          type: "exact",
          value: 5,
        },
      });
    });

    test("range where start is less than end parses successfully", () => {
      expect(parseField("1-5", 0, 59)).toEqual({
        success: true,
        value: {
          type: "range",
          start: 1,
          end: 5,
        },
      });
      expect(parseField("10-25", 0, 59)).toEqual({
        success: true,
        value: {
          type: "range",
          start: 10,
          end: 25,
        },
      });
    });

    test("descending range where start exceeds end is rejected", () => {
      expect(parseField("5-1", 0, 59)).toEqual({
        success: false,
        error: "invalid range",
      });
      expect(parseField("20-10", 0, 59)).toEqual({
        success: false,
        error: "invalid range",
      });
    });

    test("step with maximum step value", () => {
      expect(parseField("*/59", 0, 59)).toEqual({
        success: true,
        value: {
          type: "step",
          start: null,
          end: null,
          step: 59,
        },
      });
    });

    test("step with range at boundaries", () => {
      expect(parseField("0-59/10", 0, 59)).toEqual({
        success: true,
        value: {
          type: "step",
          start: 0,
          end: 59,
          step: 10,
        },
      });
    });

    test("step with invalid step value", () => {
      expect(parseField("*/abc", 0, 59)).toEqual({
        success: false,
        error: "malformed syntax",
      });
    });

    test("step with negative step", () => {
      expect(parseField("*/-5", 0, 59)).toEqual({
        success: false,
        error: "malformed syntax",
      });
    });

    test("step with decimal step", () => {
      expect(parseField("*/1.5", 0, 59)).toEqual({
        success: false,
        error: "malformed syntax",
      });
    });

    test("step with invalid range base", () => {
      expect(parseField("1-abc/5", 0, 59)).toEqual({
        success: false,
        error: "malformed syntax",
      });
    });

    test("step with range where start > end is rejected", () => {
      expect(parseField("10-5/2", 0, 59)).toEqual({
        success: false,
        error: "invalid range",
      });
    });

    test("special characters", () => {
      expect(parseField("@daily", 0, 59)).toEqual({
        success: false,
        error: "non-numeric value",
      });
    });

    test("mixed letters and numbers", () => {
      expect(parseField("1a2b", 0, 59)).toEqual({
        success: false,
        error: "non-numeric value",
      });
    });

    test("list with empty values", () => {
      expect(parseField("1,,2", 0, 59)).toEqual({
        success: false,
        error: "malformed syntax",
      });
    });

    test("list with trailing comma", () => {
      expect(parseField("1,2,", 0, 59)).toEqual({
        success: false,
        error: "malformed syntax",
      });
    });

    test("list with leading comma", () => {
      expect(parseField(",1,2", 0, 59)).toEqual({
        success: false,
        error: "malformed syntax",
      });
    });

    test("multiple slashes", () => {
      expect(parseField("*/5/2", 0, 59)).toEqual({
        success: false,
        error: "malformed syntax",
      });
    });

    test("range with multiple dashes", () => {
      expect(parseField("1--5", 0, 59)).toEqual({
        success: false,
        error: "malformed syntax",
      });
    });

    test("value exactly at zero for fields that allow it", () => {
      expect(parseField("0", 0, 23)).toEqual({
        success: true,
        value: {
          type: "exact",
          value: 0,
        },
      });
    });

    test("day-of-week value 7 (Sunday)", () => {
      expect(parseField("7", 0, 7)).toEqual({
        success: true,
        value: {
          type: "exact",
          value: 7,
        },
      });
    });

    test("day-of-week range including 7", () => {
      expect(parseField("5-7", 0, 7)).toEqual({
        success: true,
        value: {
          type: "range",
          start: 5,
          end: 7,
        },
      });
    });

    test("day-of-week list including 7", () => {
      expect(parseField("0,7", 0, 7)).toEqual({
        success: true,
        value: {
          type: "list",
          values: [0, 7],
        },
      });
    });

    test("day-of-week step with 7", () => {
      expect(parseField("*/7", 0, 7)).toEqual({
        success: true,
        value: {
          type: "step",
          start: null,
          end: null,
          step: 7,
        },
      });
    });

    test("day-of-week range 0-7 (full week)", () => {
      expect(parseField("0-7", 0, 7)).toEqual({
        success: true,
        value: {
          type: "range",
          start: 0,
          end: 7,
        },
      });
    });

    test("day-of-week descending range is rejected", () => {
      expect(parseField("7-0", 0, 7)).toEqual({
        success: false,
        error: "invalid range",
      });
    });

    test("very large number", () => {
      expect(parseField("999999", 0, 59)).toEqual({
        success: false,
        error: "value exceeds maximum",
      });
    });

    test("list with many values", () => {
      expect(parseField("1,2,3,4,5,6,7,8,9,10", 0, 59)).toEqual({
        success: true,
        value: {
          type: "list",
          values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
      });
    });

    test("step with step of 1", () => {
      expect(parseField("*/1", 0, 59)).toEqual({
        success: true,
        value: {
          type: "step",
          start: null,
          end: null,
          step: 1,
        },
      });
    });

    test("step with range and step of 1", () => {
      expect(parseField("0-10/1", 0, 59)).toEqual({
        success: true,
        value: {
          type: "step",
          start: 0,
          end: 10,
          step: 1,
        },
      });
    });
  });

  describe("field-specific boundaries", () => {
    test("minute field: 0-59", () => {
      expect(parseField("0", 0, 59)).toEqual({
        success: true,
        value: { type: "exact", value: 0 },
      });
      expect(parseField("59", 0, 59)).toEqual({
        success: true,
        value: { type: "exact", value: 59 },
      });
    });

    test("hour field: 0-23", () => {
      expect(parseField("0", 0, 23)).toEqual({
        success: true,
        value: { type: "exact", value: 0 },
      });
      expect(parseField("23", 0, 23)).toEqual({
        success: true,
        value: { type: "exact", value: 23 },
      });
    });

    test("day-of-month field: 1-31", () => {
      expect(parseField("1", 1, 31)).toEqual({
        success: true,
        value: { type: "exact", value: 1 },
      });
      expect(parseField("31", 1, 31)).toEqual({
        success: true,
        value: { type: "exact", value: 31 },
      });
    });

    test("month field: 1-12", () => {
      expect(parseField("1", 1, 12)).toEqual({
        success: true,
        value: { type: "exact", value: 1 },
      });
      expect(parseField("12", 1, 12)).toEqual({
        success: true,
        value: { type: "exact", value: 12 },
      });
    });

    test("day-of-week field: 0-7", () => {
      expect(parseField("0", 0, 7)).toEqual({
        success: true,
        value: { type: "exact", value: 0 },
      });
      expect(parseField("7", 0, 7)).toEqual({
        success: true,
        value: { type: "exact", value: 7 },
      });
    });
  });
});
