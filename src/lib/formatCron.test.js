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
      [0, ""],
      [5, "05"],
      [30, "30"],
      [59, "59"],
    ])("minute %d formats as %s", (minute, expected) => {
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
});
