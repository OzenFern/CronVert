import formatCron from "./formatCron.js";

describe("formatCron", () => {
  describe("basic schedules", () => {
    test("every minute", () => {
      const parsedCron = {
        minute: { type: "any" },
        hour: { type: "any" },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("Every minute.");
    });

    test("exact time every day", () => {
      const parsedCron = {
        minute: { type: "exact", value: 30 },
        hour: { type: "exact", value: 14 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 2:30 PM every day.");
    });

    test("weekday schedule with range", () => {
      const parsedCron = {
        minute: { type: "exact", value: 30 },
        hour: { type: "exact", value: 14 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "range", start: 1, end: 5 },
      };

      expect(formatCron(parsedCron)).toBe("At 2:30 PM, Monday through Friday.");
    });

    test("list of weekdays", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "list", values: [1, 3, 5] },
      };

      expect(formatCron(parsedCron)).toBe("At 9 AM, Monday, Wednesday and Friday.");
    });

    test("every 15 minutes", () => {
      const parsedCron = {
        minute: { type: "step", start: null, end: null, step: 15 },
        hour: { type: "any" },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("Every 15 minutes.");
    });

    test("exact date and month", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 12 },
        dayOfMonth: { type: "exact", value: 15 },
        month: { type: "exact", value: 1 },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 12 PM on the 15th of January.");
    });
  });

  describe("time formatting", () => {
    test.each([
      [0, "At 12 AM"],
      [1, "At 1 AM"],
      [11, "At 11 AM"],
      [12, "At 12 PM"],
      [13, "At 1 PM"],
      [14, "At 2 PM"],
      [23, "At 11 PM"],
    ])("hour %d converts to %s", (hour, expected) => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: hour },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toContain(expected);
    });
  });

  describe("minute formatting", () => {
    test.each([
      [0, "At 2 PM"],
      [1, "At 2:01 PM"],
      [5, "At 2:05 PM"],
      [9, "At 2:09 PM"],
      [10, "At 2:10 PM"],
      [30, "At 2:30 PM"],
      [59, "At 2:59 PM"],
    ])("minute %d formats correctly", (minute, expected) => {
      const parsedCron = {
        minute: { type: "exact", value: minute },
        hour: { type: "exact", value: 14 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toContain(expected);
    });
  });

  describe("day of month formatting", () => {
    test.each([
      [1, "1st"],
      [2, "2nd"],
      [3, "3rd"],
      [4, "4th"],
      [11, "11th"],
      [12, "12th"],
      [13, "13th"],
      [21, "21st"],
      [22, "22nd"],
      [23, "23rd"],
      [31, "31st"],
    ])("day %d uses the correct ordinal suffix", (day, ordinal) => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "exact", value: day },
        month: { type: "exact", value: 1 },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe(`At 9 AM on the ${ordinal} of January.`);
    });

    test("exact day without a month means every month", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "exact", value: 15 },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 9 AM on the 15th of every month.");
    });
  });

  describe("month formatting", () => {
    test.each([
      [1, "January"],
      [2, "February"],
      [6, "June"],
      [12, "December"],
    ])("month %d formats as %s", (month, monthName) => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "any" },
        month: { type: "exact", value: month },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toContain(monthName);
    });

    test("month list formats naturally", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "any" },
        month: { type: "list", values: [1, 3, 5] },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 9 AM every day in January, March and May.");
    });
  });

  describe("weekday edge cases", () => {
    test.each([
      [0, "Sunday"],
      [1, "Monday"],
      [6, "Saturday"],
      [7, "Sunday"],
    ])("weekday value %d formats as %s", (day, dayName) => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "exact", value: day },
      };

      expect(formatCron(parsedCron)).toContain(dayName);
    });

    test("weekday range ending at 7 handles Sunday correctly", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "range", start: 5, end: 7 },
      };

      expect(formatCron(parsedCron)).toBe("At 9 AM, Friday through Sunday.");
    });
  });

  describe("step formatting", () => {
    test.each([
      [1, "Every minute."],
      [5, "Every 5 minutes."],
      [15, "Every 15 minutes."],
      [30, "Every 30 minutes."],
    ])("every %d minutes formats correctly", (step, expected) => {
      const parsedCron = {
        minute: { type: "step", start: null, end: null, step },
        hour: { type: "any" },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe(expected);
    });

    test("step with an explicit range includes its boundaries", () => {
      const parsedCron = {
        minute: { type: "step", start: 0, end: 30, step: 10 },
        hour: { type: "any" },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toContain("10");
      expect(formatCron(parsedCron)).toContain("30");
    });
  });

  describe("range formatting", () => {
    test("minute range", () => {
      const parsedCron = {
        minute: { type: "range", start: 0, end: 30 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At minutes 0 through 30 during the 9 AM hour.");
    });

    test("hour range", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "range", start: 9, end: 17 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At minute 0 during hours 9 AM through 5 PM.");
    });

    test("day of month range", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "range", start: 1, end: 15 },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 9 AM on the 1st through 15th of every month.");
    });

    test("month range", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "any" },
        month: { type: "range", start: 3, end: 6 },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 9 AM every day in March through June.");
    });
  });

  describe("list formatting", () => {
    test("minute list", () => {
      const parsedCron = {
        minute: { type: "list", values: [0, 15, 30, 45] },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At minutes 0, 15, 30 and 45 during the 9 AM hour.");
    });

    test("hour list", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "list", values: [9, 12, 15] },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At minute 0 during hours 9 AM, 12 PM and 3 PM.");
    });

    test("day of month list", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "list", values: [1, 15, 30] },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 9 AM on the 1st, 15th and 30th of every month.");
    });
  });

  describe("step with explicit range", () => {
    test("step with range for minutes", () => {
      const parsedCron = {
        minute: { type: "step", start: 0, end: 30, step: 5 },
        hour: { type: "any" },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("Every 5 minutes from 0 through 30.");
    });

    test("step with range for hours", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "step", start: 9, end: 17, step: 2 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe(
        "At minute 0 during hours every 2 hours from 9 AM through 5 PM.",
      );
    });

    test("step with range for days of month", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "step", start: 1, end: 15, step: 3 },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe(
        "At 9 AM every 3 days from 1st through 15th of every month.",
      );
    });

    test("step with range for months", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "any" },
        month: { type: "step", start: 1, end: 6, step: 2 },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe(
        "At 9 AM every day, every 2 months from January through June.",
      );
    });
  });

  describe("step unit formatting", () => {
    test("step of 1 uses singular form", () => {
      const parsedCron = {
        minute: { type: "step", start: null, end: null, step: 1 },
        hour: { type: "any" },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("Every minute.");
    });

    test("step of 1 for hours", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "step", start: null, end: null, step: 1 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At minute 0 during hours every hour.");
    });

    test("step of 1 for days", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "step", start: null, end: null, step: 1 },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 9 AM every day of every month.");
    });
  });

  describe("complex combinations", () => {
    test("time with date and weekday", () => {
      const parsedCron = {
        minute: { type: "exact", value: 30 },
        hour: { type: "exact", value: 14 },
        dayOfMonth: { type: "exact", value: 15 },
        month: { type: "exact", value: 1 },
        dayOfWeek: { type: "exact", value: 1 },
      };

      expect(formatCron(parsedCron)).toBe("At 2:30 PM on the 15th of January, Monday.");
    });

    test("time with weekday range and month", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "any" },
        month: { type: "list", values: [6, 7, 8] },
        dayOfWeek: { type: "range", start: 1, end: 5 },
      };

      expect(formatCron(parsedCron)).toBe(
        "At 9 AM every day in June, July and August, Monday through Friday.",
      );
    });

    test("every minute during specific hours on specific days", () => {
      const parsedCron = {
        minute: { type: "any" },
        hour: { type: "range", start: 9, end: 17 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "list", values: [1, 2, 3, 4, 5] },
      };

      expect(formatCron(parsedCron)).toBe(
        "Every minute during hours 9 AM through 5 PM, Monday, Tuesday, Wednesday, Thursday and Friday.",
      );
    });

    test("step minutes during specific hours", () => {
      const parsedCron = {
        minute: { type: "step", start: null, end: null, step: 15 },
        hour: { type: "list", values: [9, 12, 15] },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("Every 15 minutes during hours 9 AM, 12 PM and 3 PM.");
    });
  });

  describe("minute at start of hour", () => {
    test("minute 0 of every hour", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "any" },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At the start of every hour.");
    });

    test("minute 0 at specific hour", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 14 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 2 PM every day.");
    });
  });

  describe("every minute during specific hours", () => {
    test("every minute during one hour", () => {
      const parsedCron = {
        minute: { type: "any" },
        hour: { type: "exact", value: 14 },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("Every minute during the 2 PM hour.");
    });

    test("every minute during multiple hours", () => {
      const parsedCron = {
        minute: { type: "any" },
        hour: { type: "list", values: [9, 14, 17] },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("Every minute during hours 9 AM, 2 PM and 5 PM.");
    });
  });

  describe("date without month restrictions", () => {
    test("specific day every month", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "exact", value: 1 },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 9 AM on the 1st of every month.");
    });

    test("step day every month", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "step", start: null, end: null, step: 7 },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 9 AM every 7 days of every month.");
    });
  });

  describe("month without day restrictions", () => {
    test("every day in specific month", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "any" },
        month: { type: "exact", value: 12 },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 9 AM every day in December.");
    });

    test("every day in multiple months", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "any" },
        month: { type: "list", values: [1, 4, 7, 10] },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 9 AM every day in January, April, July and October.");
    });

    test("every day with step months", () => {
      const parsedCron = {
        minute: { type: "exact", value: 0 },
        hour: { type: "exact", value: 9 },
        dayOfMonth: { type: "any" },
        month: { type: "step", start: null, end: null, step: 3 },
        dayOfWeek: { type: "any" },
      };

      expect(formatCron(parsedCron)).toBe("At 9 AM every day, every 3 months.");
    });
  });

  describe("defensive tests", () => {
    test("unsupported field type returns field name", () => {
      const parsedCron = {
        minute: { type: "unknown", value: 0 },
        hour: { type: "any" },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      const result = formatCron(parsedCron);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    test("empty or malformed parsed object returns a result", () => {
      const parsedCron = {
        minute: {},
        hour: {},
        dayOfMonth: {},
        month: {},
        dayOfWeek: {},
      };

      const result = formatCron(parsedCron);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    test("extreme values in ranges are handled", () => {
      const parsedCron = {
        minute: { type: "range", start: 0, end: 59 },
        hour: { type: "any" },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      const result = formatCron(parsedCron);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    test("complex combination returns some description", () => {
      const parsedCron = {
        minute: { type: "range", start: 0, end: 30 },
        hour: { type: "list", values: [9, 12, 15] },
        dayOfMonth: { type: "any" },
        month: { type: "any" },
        dayOfWeek: { type: "any" },
      };

      const result = formatCron(parsedCron);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });
});
