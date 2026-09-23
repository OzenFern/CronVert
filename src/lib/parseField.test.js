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
      expect(() => parseField("60", 0, 59)).toEqual({
        success: false,
        error: "value exceeds maximum",
      });
    });

    test("value below minimum", () => {
      expect(() => parseField("-1", 0, 59)).toEqual({
        success: false,
        error: "value below minimum",
      });
    });

    test("non-numeric value", () => {
      expect(() => parseField("abc", 0, 59)).toEqual({
        success: false,
        error: "non-numeric value",
      });
    });

    test("range exceeds maximum", () => {
      expect(() => parseField("1-60", 0, 59)).toEqual({
        success: false,
        error: "range exceeds maximum",
      });
    });
  });

  describe("malformed syntax", () => {
    test.each(["1-", "-5", "1--5", "1/", "*/0"])("malformed syntax: %s", (field) => {
      expect(() => parseField(field, 0, 59)).toEqual({
        success: false,
        error: "malformed syntax",
      });
    });
  });
});
