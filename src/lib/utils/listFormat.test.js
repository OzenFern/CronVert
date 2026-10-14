import ListFormat from "./listFormat.js";

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
