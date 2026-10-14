import formatSentence from "./formatSentence.js";

// Test the output and return type of the formatSentence function
describe("Test Sentence conversion", () => {
  test.each([
    ["abc", "Abc."],
    ["today is Monday", "Today is Monday."],
    ["   Every minute. ", "Every minute."],
    ["    xYz    ", "XYz."],
    ["Tomorrow is 15th October.", "Tomorrow is 15th October."],
  ])("Input string:%s \n Converted sentence:%s", (string, sentence) => {
    expect(formatSentence(string)).toEqual(sentence);
    expectTypeOf(formatSentence(string)).toBeString();
  });
});
