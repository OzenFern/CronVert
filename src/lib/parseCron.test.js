describe("parseCron", () => {
  describe("valid CRON expressions", () => {
    test("standard 5-field expression", () => {
      expect(parseCron("30 14 * * 1-5")).toEqual({
        success: true,
        value: {
          minute: {
            type: "exact",
            value: 30
          },
          hour: {
            type: "exact",
            value: 14
          },
          dayOfMonth: {
            type: "any"
          },
          month: {
            type: "any"
          },
          dayOfWeek: {
            type: "range",
            start: 1,
            end: 5
          }
        }
      });
    });

    test("all wildcards", () => {
      expect(parseCron("* * * * *")).toEqual({
        success: true,
        value: {
          minute: {
            type: "any"
          },
          hour: {
            type: "any"
          },
          dayOfMonth: {
            type: "any"
          },
          month: {
            type: "any"
          },
          dayOfWeek: {
            type: "any"
          }
        }
      });
    });

    test("list of weekdays", () => {
      expect(parseCron("0 9 * * 1,3,5")).toEqual({
        success: true,
        value: {
          minute: {
            type: "exact",
            value: 0
          },
          hour: {
            type: "exact",
            value: 9
          },
          dayOfMonth: {
            type: "any"
          },
          month: {
            type: "any"
          },
          dayOfWeek: {
            type: "list",
            values: [1, 3, 5]
          }
        }
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
            step: 15
          },
          hour: { type: "any" },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "any" }
        }
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
            step: 2
          },
          hour: { type: "any" },
          dayOfMonth: { type: "any" },
          month: { type: "any" },
          dayOfWeek: { type: "any" }
        }
      });
    });

    test("multiple whitespace characters", () => {
      expect(parseCron("30   14   *   *   1-5")).toEqual({
        success: true,
        value: {
          minute: {
            type: "exact",
            value: 30
          },
          hour: {
            type: "exact",
            value: 14
          },
          dayOfMonth: {
            type: "any"
          },
          month: {
            type: "any"
          },
          dayOfWeek: {
            type: "range",
            start: 1,
            end: 5
          }
        }
      });
    });
  });

  describe("invalid field counts", () => {
    test("fewer than 5 fields", () => {
      expect(() => parseCron("* * * *")).toThrow({
        success: false,
        error: "fewer than 5 fields"
      });
    });

    test("more than 5 fields", () => {
      expect(() => parseCron("* * * * * *")).toThrow({
        success: false,
        error: "more than 5 fields"
      });
    });
  });

  describe("invalid field values", () => {
    test("invalid minute value", () => {
      expect(() => parseCron("60 * * * *")).toThrow({
        success: false,
        error: "invalid minute value"
      } );
    });

    test("invalid hour value", () => {
      expect(() => parseCron("* 24 * * *")).toThrow({
        success: false,
        error: "invalid hour value"
      });
    });

    test("invalid day-of-month value", () => {
      expect(() => parseCron("* * 32 * *")).toThrow({
        success: false,
        error: "invalid day-of-month value"
      });
    });

    test("invalid month value", () => {
      expect(() => parseCron("* * * 13 *")).toThrow({
        success: false,
        error: "invalid month value"
      });
    });

    test("invalid day-of-week value", () => {
      expect(() => parseCron("* * * * 8")).toThrow({
        success: false,
        error: "invalid day-of-week value"
      });
    });
  });
});
