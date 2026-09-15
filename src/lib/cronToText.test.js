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
        value: "At 9:00 AM, Monday through Friday.",
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
        value: "At 9:00 AM, Monday, Wednesday, and Friday.",
      });
    });
  });

  describe("error handling", () => {
    test("invalid CRON expression throws error", () => {
      expect(() => cronToText("invalid")).toThrow({
        success: false,
        error: "invalid CRON expression",
      });
    });

    test("invalid field values throw error", () => {
      expect(() => cronToText("60 * * * *")).toThrow({
        success: false,
        error: "invalid field values",
      });
    });

    test("incorrect number of fields throws error", () => {
      expect(() => cronToText("* * *")).toThrow({
        success: false,
        error: "incorrect number of fields",
      });
    });
  });
});
