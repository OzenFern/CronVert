import ListFormat from "./listFormat.js";

describe("ListFormat", () => {
  // Test the output and return type of the listFormat function
  describe("Joins an array into string using 'and' conjunction", () => {
    test.each([
      [[1, 2, 3], "1, 2 and 3"],
      [["apples", "oranges", "bananas"], "apples, oranges and bananas"],
      [[10, "ABC", 20, "xyz"], "10, ABC, 20 and xyz"],
      [["pqr", null, undefined, 20], "pqr and 20"],
      [["tuv"], "tuv"],
    ])("Input array: $0\nExpected Output: $1", (list, expected) => {
      expect(ListFormat(list)).toEqual(expected);
      expectTypeOf(ListFormat(list)).toBeString();
    });
  });

  describe("Duplicate elements in the list are skipped", () => {
    test.each([
      [[1, 1, 2], "1 and 2"],
      [[4, 5, 5, 6], "4, 5 and 6"],
      [["x", "y", "z", "x"], "x, y and z"],
      [["mango", "mango", "mango"], "mango"],
    ])("Input duplicated array elements: $0\nDeduplicated array: $1", (list, expected) => {
      expect(ListFormat(list)).toEqual(expected);
    });
  });
});
