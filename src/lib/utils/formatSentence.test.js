import formatSentence from "./formatSentence.js";

describe("Test Sentence conversion", () => {
  test.each([
    ["abc", "Abc."],
    ["today is Monday", "Today is Monday."],
    ["   Every minute. ", "Every minute."],
    ["    xYz    ", "XYz."],
    ["Tomorrow is 15th October.", "Tomorrow is 15th October."],
  ])("Input string:%s \n Converted sentence:%s", (string, sentence) => {
    expect(formatSentence(string)).toEqual(sentence);
  });
});
