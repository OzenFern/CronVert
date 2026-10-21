import cronToText from "./cronToText.js";

describe("cronToText", () => {
  describe("end-to-end conversions", () => {
    test("every minute", () => {
      expect(cronToText("* * * * *")).toEqual({
        success: true,
        value: "Every minute.",
      });
    });

    test("exact time every day", () => {
      expect(cronToText("30 14 * * *")).toEqual({
        success: true,
        value: "At 2:30 PM every day.",
      });
    });

    test("weekday schedule with range", () => {
      expect(cronToText("0 9 * * 1-5")).toEqual({
        success: true,
        value: "At 9 AM, Monday through Friday.",
      });
    });

    test("every 15 minutes", () => {
      expect(cronToText("*/15 * * * *")).toEqual({
        success: true,
        value: "Every 15 minutes.",
      });
    });

    test("list of weekdays", () => {
      expect(cronToText("0 9 * * 1,3,5")).toEqual({
        success: true,
        value: "At 9 AM, Monday, Wednesday and Friday.",
      });
    });

    test("stepped range on minutes", () => {
      expect(cronToText("1-10/2 * * * *")).toEqual({
        success: true,
        value: "Every 2 minutes from 1 through 10.",
      });
    });

    test("multiple whitespace characters", () => {
      expect(cronToText("30   14   *   *   1-5")).toEqual({
        success: true,
        value: "At 2:30 PM, Monday through Friday.",
      });
    });

    test("tabs between fields", () => {
      expect(cronToText("30\t14\t*\t*\t1-5")).toEqual({
        success: true,
        value: "At 2:30 PM, Monday through Friday.",
      });
    });

    test("mixed tabs and spaces", () => {
      expect(cronToText("30\t 14 \t* \t * 1-5")).toEqual({
        success: true,
        value: "At 2:30 PM, Monday through Friday.",
      });
    });

    test("leading whitespace", () => {
      expect(cronToText("  30 14 * * 1-5")).toEqual({
        success: true,
        value: "At 2:30 PM, Monday through Friday.",
      });
    });

    test("trailing whitespace", () => {
      expect(cronToText("30 14 * * 1-5  ")).toEqual({
        success: true,
        value: "At 2:30 PM, Monday through Friday.",
      });
    });

    test("leading and trailing whitespace", () => {
      expect(cronToText("  30 14 * * 1-5  ")).toEqual({
        success: true,
        value: "At 2:30 PM, Monday through Friday.",
      });
    });

    test("day-of-week value repeating in range", () => {
      expect(cronToText("0 9 * * 1-1")).toEqual({
        success: true,
        value: "At 9 AM, Monday.",
      });
    });

    test("day-of-week range including 7", () => {
      expect(cronToText("0 9 * * 5-7")).toEqual({
        success: true,
        value: "At 9 AM, Friday through Sunday.",
      });
    });

    test("day-of-week range 0-7 (full week)", () => {
      expect(cronToText("0 9 * * 0-7")).toEqual({
        success: true,
        value: "At 9 AM, Sunday.",
      });
    });

    test("day-of-week list including 7", () => {
      expect(cronToText("0 9 * * 0,7")).toEqual({
        success: true,
        value: "At 9 AM, Sunday.",
      });
    });

    test("day-of-week step with 7", () => {
      expect(cronToText("0 9 * * */7")).toEqual({
        success: true,
        value: "At 9 AM, every 7 days of the week.",
      });
    });

    test("minute at boundary (0)", () => {
      expect(cronToText("0 14 * * 1-5")).toEqual({
        success: true,
        value: "At 2 PM, Monday through Friday.",
      });
    });

    test("minute at boundary (59)", () => {
      expect(cronToText("59 14 * * 1-5")).toEqual({
        success: true,
        value: "At 2:59 PM, Monday through Friday.",
      });
    });

    test("hour at boundary (0)", () => {
      expect(cronToText("30 0 * * 1-5")).toEqual({
        success: true,
        value: "At 12:30 AM, Monday through Friday.",
      });
    });

    test("hour at boundary (23)", () => {
      expect(cronToText("30 23 * * 1-5")).toEqual({
        success: true,
        value: "At 11:30 PM, Monday through Friday.",
      });
    });

    test("day-of-month at boundary (1)", () => {
      expect(cronToText("30 14 1 * 1-5")).toEqual({
        success: true,
        value: "At 2:30 PM on the 1st of every month, Monday through Friday.",
      });
    });

    test("day-of-month at boundary (31)", () => {
      expect(cronToText("30 14 31 * 1-5")).toEqual({
        success: true,
        value: "At 2:30 PM on the 31st of every month, Monday through Friday.",
      });
    });

    test("month at boundary (1)", () => {
      expect(cronToText("30 14 * 1 1-5")).toEqual({
        success: true,
        value: "At 2:30 PM every day in January, Monday through Friday.",
      });
    });

    test("month at boundary (12)", () => {
      expect(cronToText("30 14 * 12 1-5")).toEqual({
        success: true,
        value: "At 2:30 PM every day in December, Monday through Friday.",
      });
    });

    test("complex valid expression with all field types", () => {
      expect(cronToText("0-30/5 9-17 1,15,30 1-6/2 1-5")).toEqual({
        success: true,
        value:
          "Every 5 minutes from 0 through 30 during hours 9 AM through 5 PM on the 1st, 15th and 30th of every 2 months from January through June, Monday through Friday.",
      });
    });

    test("all fields as step with null range", () => {
      expect(cronToText("*/5 */2 */3 */4 */5")).toEqual({
        success: true,
        value:
          "Every 5 minutes during hours every 2 hours every 3 days in every 4 months, every 5 days of the week.",
      });
    });

    test("all fields as lists", () => {
      expect(cronToText("0,15,30,45 0,6,12,18 1,15 1,4,7,10 1,3,5")).toEqual({
        success: true,
        value:
          "At minutes 0, 15, 30 and 45 during hours 12 AM, 6 AM, 12 PM and 6 PM on the 1st and 15th of January, April, July and October, Monday, Wednesday and Friday.",
      });
    });

    test("range where start equals end", () => {
      expect(cronToText("30 14 15-15 * *")).toEqual({
        success: true,
        value: "At 2:30 PM on the 15th of every month.",
      });
    });

    test("single item in list", () => {
      expect(cronToText("30 * * * *")).toEqual({
        success: true,
        value: "At minute 30 of every hour.",
      });
    });

    test("newline characters between fields", () => {
      expect(cronToText("30\n14\n*\n*\n1-5")).toEqual({
        success: true,
        value: "At 2:30 PM, Monday through Friday.",
      });
    });
  });

  describe("error handling", () => {
    test("invalid CRON expression throws error", () => {
      expect(cronToText("invalid")).toEqual({
        success: false,
        error: {
          message: "fewer than 5 fields",
        },
      });
    });

    test("invalid field values throw error", () => {
      expect(cronToText("60 * * * *")).toEqual({
        success: false,
        error: {
          message: "invalid minute value",
          description: "value exceeds maximum",
        },
      });
    });

    test("incorrect number of fields throws error", () => {
      expect(cronToText("* * *")).toEqual({
        success: false,
        error: {
          message: "fewer than 5 fields",
        },
      });
    });

    test("more than 5 fields throws error", () => {
      expect(cronToText("* * * * * *")).toEqual({
        success: false,
        error: {
          message: "more than 5 fields",
        },
      });
    });

    test("empty string throws error", () => {
      expect(cronToText("")).toEqual({
        success: false,
        error: {
          message: "fewer than 5 fields",
        },
      });
    });

    test("whitespace only throws error", () => {
      expect(cronToText("   ")).toEqual({
        success: false,
        error: {
          message: "fewer than 5 fields",
        },
      });
    });

    test("invalid hour value throws error", () => {
      expect(cronToText("* 24 * * *")).toEqual({
        success: false,
        error: {
          message: "invalid hour value",
          description: "value exceeds maximum",
        },
      });
    });

    test("invalid day-of-month value throws error", () => {
      expect(cronToText("* * 32 * *")).toEqual({
        success: false,
        error: {
          message: "invalid day-of-month value",
          description: "value exceeds maximum",
        },
      });
    });

    test("invalid month value throws error", () => {
      expect(cronToText("* * * 13 *")).toEqual({
        success: false,
        error: {
          message: "invalid month value",
          description: "value exceeds maximum",
        },
      });
    });

    test("invalid day-of-week value throws error", () => {
      expect(cronToText("* * * * 8")).toEqual({
        success: false,
        error: {
          message: "invalid day-of-week value",
          description: "value exceeds maximum",
        },
      });
    });

    test("negative minute value throws error", () => {
      expect(cronToText("-1 * * * *")).toEqual({
        success: false,
        error: {
          message: "invalid minute value",
          description: "value below minimum",
        },
      });
    });

    test("negative hour value throws error", () => {
      expect(cronToText("* -1 * * *")).toEqual({
        success: false,
        error: {
          message: "invalid hour value",
          description: "value below minimum",
        },
      });
    });

    test("negative day-of-month value throws error", () => {
      expect(cronToText("* * -1 * *")).toEqual({
        success: false,
        error: {
          message: "invalid day-of-month value",
          description: "value below minimum",
        },
      });
    });

    test("negative month value throws error", () => {
      expect(cronToText("* * * -1 *")).toEqual({
        success: false,
        error: {
          message: "invalid month value",
          description: "value below minimum",
        },
      });
    });

    test("negative day-of-week value throws error", () => {
      expect(cronToText("* * * * -1")).toEqual({
        success: false,
        error: {
          message: "invalid day-of-week value",
          description: "value below minimum",
        },
      });
    });

    test("decimal minute value throws error", () => {
      expect(cronToText("1.5 * * * *")).toEqual({
        success: false,
        error: {
          message: "invalid minute value",
          description: "non-numeric value",
        },
      });
    });

    test("special characters in field throws error", () => {
      expect(cronToText("@daily * * * *")).toEqual({
        success: false,
        error: {
          message: "invalid minute value",
          description: "non-numeric value",
        },
      });
    });

    test("malformed list in minute field throws error", () => {
      expect(cronToText("1,,2 * * * *")).toEqual({
        success: false,
        error: {
          message: "invalid minute value",
          description: "malformed syntax",
        },
      });
    });

    test("malformed range in hour field throws error", () => {
      expect(cronToText("* 1- * * *")).toEqual({
        success: false,
        error: {
          message: "invalid hour value",
          description: "malformed syntax",
        },
      });
    });

    test("malformed step in day-of-month field throws error", () => {
      expect(cronToText("* * */ * *")).toEqual({
        success: false,
        error: {
          message: "invalid day-of-month value",
          description: "malformed syntax",
        },
      });
    });

    test("step with zero increment in minute throws error", () => {
      expect(cronToText("*/0 * * * *")).toEqual({
        success: false,
        error: {
          message: "invalid minute value",
          description: "value below minimum",
        },
      });
    });

    test("step with zero increment in hour throws error", () => {
      expect(cronToText("* */0 * * *")).toEqual({
        success: false,
        error: {
          message: "invalid hour value",
          description: "value below minimum",
        },
      });
    });

    test("step with zero increment in day-of-month throws error", () => {
      expect(cronToText("* * */0 * *")).toEqual({
        success: false,
        error: {
          message: "invalid day-of-month value",
          description: "value below minimum",
        },
      });
    });

    test("step with zero increment in month throws error", () => {
      expect(cronToText("* * * */0 *")).toEqual({
        success: false,
        error: {
          message: "invalid month value",
          description: "value below minimum",
        },
      });
    });

    test("step with zero increment in day-of-week throws error", () => {
      expect(cronToText("* * * * */0")).toEqual({
        success: false,
        error: {
          message: "invalid day-of-week value",
          description: "value below minimum",
        },
      });
    });

    test("very large number in field throws error", () => {
      expect(cronToText("999999 * * * *")).toEqual({
        success: false,
        error: {
          message: "invalid minute value",
          description: "value exceeds maximum",
        },
      });
    });
  });
});
