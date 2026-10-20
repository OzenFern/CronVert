import parseCron from "./parseCron.js";

describe("parseCron", () => {
  describe("valid CRON expressions", () => {
    test("standard 5-field expression", () => {
      expect(parseCron("30 14 * * 1-5")).toEqual({
        success: true,
        value: {
          minute: {
            type: "exact",
            value: 30,
          },
          hour: {
            type: "exact",
            value: 14,
          },
          dayOfMonth: {
            type: "any",
          },
          month: {
            type: "any",
          },
          dayOfWeek: {
            type: "range",
            start: 1,
            end: 5,
          },
        },
      });
    });

    test("all wildcards", () => {
      expect(parseCron("* * * * *")).toEqual({
        success: true,
        value: {
          minute: {
            type: "any",
          },
          hour: {
            type: "any",
          },
          dayOfMonth: {
            type: "any",
          },
          month: {
            type: "any",
          },
          dayOfWeek: {
            type: "any",
          },
        },
      });
    });

    test("list of weekdays", () => {
      expect(parseCron("0 9 * * 1,3,5")).toEqual({
        success: true,
        value: {
          minute: {
            type: "exact",
            value: 0,
          },
          hour: {
            type: "exact",
            value: 9,
          },
          dayOfMonth: {
            type: "any",
          },
          month: {
            type: "any",
          },
          dayOfWeek: {
            type: "list",
            values: [1, 3, 5],
          },
        },
      });
    });

    test("step on minutes", () => {
      expect(parseCron("*/15 * * * *")).toEqual({
        success: true,
        value: {
          minute: {
            type: "step",
            start: null,
            end: null,
            step: 15,
          },
          hour: { type: "any" },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "any" },
        },
      });
    });

    test("stepped range on minutes", () => {
      expect(parseCron("1-10/2 * * * *")).toEqual({
        success: true,
        value: {
          minute: {
            type: "step",
            start: 1,
            end: 10,
            step: 2,
          },
          hour: { type: "any" },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "any" },
        },
      });
    });

    test("multiple whitespace characters", () => {
      expect(parseCron("30   14   *   *   1-5")).toEqual({
        success: true,
        value: {
          minute: {
            type: "exact",
            value: 30,
          },
          hour: {
            type: "exact",
            value: 14,
          },
          dayOfMonth: {
            type: "any",
          },
          month: {
            type: "any",
          },
          dayOfWeek: {
            type: "range",
            start: 1,
            end: 5,
          },
        },
      });
    });
  });

  describe("invalid field counts", () => {
    test("fewer than 5 fields", () => {
      expect(parseCron("* * * *")).toEqual({
        success: false,
        error: {
          message: "fewer than 5 fields",
        },
      });
    });

    test("more than 5 fields", () => {
      expect(parseCron("* * * * * *")).toEqual({
        success: false,
        error: {
          message: "more than 5 fields",
        },
      });
    });
  });

  describe("invalid field values", () => {
    test("invalid minute value", () => {
      expect(parseCron("60 * * * *")).toEqual({
        success: false,
        error: {
          message: "invalid minute value",
          description: "value exceeds maximum",
        },
      });
    });

    test("invalid hour value", () => {
      expect(parseCron("* 24 * * *")).toEqual({
        success: false,
        error: {
          message: "invalid hour value",
          description: "value exceeds maximum",
        },
      });
    });

    test("invalid day-of-month value", () => {
      expect(parseCron("* * 32 * *")).toEqual({
        success: false,
        error: {
          message: "invalid day-of-month value",
          description: "value exceeds maximum",
        },
      });
    });

    test("invalid month value", () => {
      expect(parseCron("* * * 13 *")).toEqual({
        success: false,
        error: {
          message: "invalid month value",
          description: "value exceeds maximum",
        },
      });
    });

    test("invalid day-of-week value", () => {
      expect(parseCron("* * * * 8")).toEqual({
        success: false,
        error: { message: "invalid day-of-week value", description: "value exceeds maximum" },
      });
    });
  });

  describe("whitespace handling", () => {
    test("single spaces between fields", () => {
      expect(parseCron("30 14 * * 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("multiple spaces between fields", () => {
      expect(parseCron("30   14   *   *   1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("tabs between fields", () => {
      expect(parseCron("30\t14\t*\t*\t1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("mixed tabs and spaces", () => {
      expect(parseCron("30\t 14 \t* \t * 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("leading whitespace", () => {
      expect(parseCron("  30 14 * * 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("trailing whitespace", () => {
      expect(parseCron("30 14 * * 1-5  ")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("leading and trailing whitespace", () => {
      expect(parseCron("  30 14 * * 1-5  ")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });
  });

  describe("edge cases and defensive tests", () => {
    test("empty string", () => {
      expect(parseCron("")).toEqual({
        success: false,
        error: { message: "fewer than 5 fields" },
      });
    });

    test("whitespace only", () => {
      expect(parseCron("   ")).toEqual({
        success: false,
        error: { message: "fewer than 5 fields" },
      });
    });

    test("all zeros", () => {
      expect(parseCron("0 0 0 0 0")).toEqual({
        success: false,
        error: { message: "invalid day-of-month value", description: "value below minimum" },
      });
    });

    test("day-of-week value 7 (Sunday)", () => {
      expect(parseCron("0 9 * * 7")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 0 },
          hour: { type: "exact", value: 9 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "exact", value: 7 },
        },
      });
    });

    test("day-of-week range including 7", () => {
      expect(parseCron("0 9 * * 5-7")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 0 },
          hour: { type: "exact", value: 9 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 5, end: 7 },
        },
      });
    });

    test("day-of-week range 0-7 (full week)", () => {
      expect(parseCron("0 9 * * 0-7")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 0 },
          hour: { type: "exact", value: 9 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 0, end: 7 },
        },
      });
    });

    test("day-of-week list including 7", () => {
      expect(parseCron("0 9 * * 0,7")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 0 },
          hour: { type: "exact", value: 9 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "list", values: [0, 7] },
        },
      });
    });

    test("day-of-week step with 7", () => {
      expect(parseCron("0 9 * * */7")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 0 },
          hour: { type: "exact", value: 9 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "step", start: null, end: null, step: 7 },
        },
      });
    });

    test("minute at boundary (0)", () => {
      expect(parseCron("0 14 * * 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 0 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("minute at boundary (59)", () => {
      expect(parseCron("59 14 * * 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 59 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("hour at boundary (0)", () => {
      expect(parseCron("30 0 * * 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 0 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("hour at boundary (23)", () => {
      expect(parseCron("30 23 * * 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 23 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("day-of-month at boundary (1)", () => {
      expect(parseCron("30 14 1 * 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "exact", value: 1 },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("day-of-month at boundary (31)", () => {
      expect(parseCron("30 14 31 * 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "exact", value: 31 },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("month at boundary (1)", () => {
      expect(parseCron("30 14 * 1 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "exact", value: 1 },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("month at boundary (12)", () => {
      expect(parseCron("30 14 * 12 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "exact", value: 12 },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("negative minute value", () => {
      expect(parseCron("-1 * * * *")).toEqual({
        success: false,
        error: { message: "invalid minute value", description: "value below minimum" },
      });
    });

    test("negative hour value", () => {
      expect(parseCron("* -1 * * *")).toEqual({
        success: false,
        error: { message: "invalid hour value", description: "value below minimum" },
      });
    });

    test("negative day-of-month value", () => {
      expect(parseCron("* * -1 * *")).toEqual({
        success: false,
        error: { message: "invalid day-of-month value", description: "value below minimum" },
      });
    });

    test("negative month value", () => {
      expect(parseCron("* * * -1 *")).toEqual({
        success: false,
        error: { message: "invalid month value", description: "value below minimum" },
      });
    });

    test("negative day-of-week value", () => {
      expect(parseCron("* * * * -1")).toEqual({
        success: false,
        error: { message: "invalid day-of-week value", description: "value below minimum" },
      });
    });

    test("decimal minute value", () => {
      expect(parseCron("1.5 * * * *")).toEqual({
        success: false,
        error: { message: "invalid minute value", description: "non-numeric value" },
      });
    });

    test("special characters in field", () => {
      expect(parseCron("@daily * * * *")).toEqual({
        success: false,
        error: { message: "invalid minute value", description: "non-numeric value" },
      });
    });

    test("malformed list in minute field", () => {
      expect(parseCron("1,,2 * * * *")).toEqual({
        success: false,
        error: { message: "invalid minute value", description: "malformed syntax" },
      });
    });

    test("malformed range in hour field", () => {
      expect(parseCron("* 1- * * *")).toEqual({
        success: false,
        error: { message: "invalid hour value", description: "malformed syntax" },
      });
    });

    test("malformed step in day-of-month field", () => {
      expect(parseCron("* * */ * *")).toEqual({
        success: false,
        error: { message: "invalid day-of-month value", description: "malformed syntax" },
      });
    });

    test("step with zero increment in minute", () => {
      expect(parseCron("*/0 * * * *")).toEqual({
        success: false,
        error: { message: "invalid minute value", description: "value below minimum" },
      });
    });

    test("step with zero increment in hour", () => {
      expect(parseCron("* */0 * * *")).toEqual({
        success: false,
        error: { message: "invalid hour value", description: "value below minimum" },
      });
    });

    test("step with zero increment in day-of-month", () => {
      expect(parseCron("* * */0 * *")).toEqual({
        success: false,
        error: { message: "invalid day-of-month value", description: "value below minimum" },
      });
    });

    test("step with zero increment in month", () => {
      expect(parseCron("* * * */0 *")).toEqual({
        success: false,
        error: { message: "invalid month value", description: "value below minimum" },
      });
    });

    test("step with zero increment in day-of-week", () => {
      expect(parseCron("* * * * */0")).toEqual({
        success: false,
        error: { message: "invalid day-of-week value", description: "value below minimum" },
      });
    });

    test("complex valid expression with all field types", () => {
      expect(parseCron("0-30/5 9-17 1,15,30 1-6/2 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "step", start: 0, end: 30, step: 5 },
          hour: { type: "range", start: 9, end: 17 },
          dayOfMonth: { type: "list", values: [1, 15, 30] },
          month: { type: "step", start: 1, end: 6, step: 2 },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("all fields as step with null range", () => {
      expect(parseCron("*/5 */2 */3 */4 */5")).toEqual({
        success: true,
        value: {
          minute: { type: "step", start: null, end: null, step: 5 },
          hour: { type: "step", start: null, end: null, step: 2 },
          dayOfMonth: { type: "step", start: null, end: null, step: 3 },
          month: { type: "step", start: null, end: null, step: 4 },
          dayOfWeek: { type: "step", start: null, end: null, step: 5 },
        },
      });
    });

    test("all fields as lists", () => {
      expect(parseCron("0,15,30,45 0,6,12,18 1,15 1,4,7,10 1,3,5")).toEqual({
        success: true,
        value: {
          minute: { type: "list", values: [0, 15, 30, 45] },
          hour: { type: "list", values: [0, 6, 12, 18] },
          dayOfMonth: { type: "list", values: [1, 15] },
          month: { type: "list", values: [1, 4, 7, 10] },
          dayOfWeek: { type: "list", values: [1, 3, 5] },
        },
      });
    });

    test("very large number in field", () => {
      expect(parseCron("999999 * * * *")).toEqual({
        success: false,
        error: { message: "invalid minute value", description: "value exceeds maximum" },
      });
    });

    test("mixed valid and invalid fields (stops at first error)", () => {
      expect(parseCron("60 25 32 13 8")).toEqual({
        success: false,
        error: { message: "invalid minute value", description: "value exceeds maximum" },
      });
    });

    test("range where start equals end", () => {
      expect(parseCron("30 14 15-15 * *")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "range", start: 15, end: 15 },
          month: { type: "any" },
          dayOfWeek: { type: "any" },
        },
      });
    });

    test("single item in list", () => {
      expect(parseCron("30 * * * *")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "any" },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "any" },
        },
      });
    });

    test("newline characters between fields", () => {
      expect(parseCron("30\n14\n*\n*\n1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("carriage return characters between fields", () => {
      expect(parseCron("30\r14\r*\r*\r1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });

    test("mixed whitespace types", () => {
      expect(parseCron("30 \t\n\r 14 \t\n\r * \t\n\r * \t\n\r 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });
  });

  describe("complex combinations", () => {
    test("step with range in all fields", () => {
      expect(parseCron("0-30/5 9-17/2 1-15/3 1-6/2 1-5/1")).toEqual({
        success: true,
        value: {
          minute: { type: "step", start: 0, end: 30, step: 5 },
          hour: { type: "step", start: 9, end: 17, step: 2 },
          dayOfMonth: { type: "step", start: 1, end: 15, step: 3 },
          month: { type: "step", start: 1, end: 6, step: 2 },
          dayOfWeek: { type: "step", start: 1, end: 5, step: 1 },
        },
      });
    });

    test("list with maximum values", () => {
      expect(parseCron("0,15,30,45 0,6,12,18 1,15,31 1,6,12 0,7")).toEqual({
        success: true,
        value: {
          minute: { type: "list", values: [0, 15, 30, 45] },
          hour: { type: "list", values: [0, 6, 12, 18] },
          dayOfMonth: { type: "list", values: [1, 15, 31] },
          month: { type: "list", values: [1, 6, 12] },
          dayOfWeek: { type: "list", values: [0, 7] },
        },
      });
    });

    test("wildcard in middle with specific other fields", () => {
      expect(parseCron("30 14 * 1,2,3 1-5")).toEqual({
        success: true,
        value: {
          minute: { type: "exact", value: 30 },
          hour: { type: "exact", value: 14 },
          dayOfMonth: { type: "any" },
          month: { type: "list", values: [1, 2, 3] },
          dayOfWeek: { type: "range", start: 1, end: 5 },
        },
      });
    });
  });
});
