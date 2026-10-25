/**
 * Formats the string into a valid sentence by capitalizing the first letter and adding a full stop at the end
 * @param string The string to format into a sentence
 * @return {string}
 */
const formatSentence = (string) => {
  const str = string.trim();
  const firstLetter = str[0];
  const suffix = str.endsWith(".") ? "" : ".";
  return firstLetter.toUpperCase() + str.slice(1) + suffix;
};

export default formatSentence;
