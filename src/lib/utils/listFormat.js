/**
 * Formats the list by printing it as a string using conjunction to join them
 * Use en-GB to avoid a comma before conjunction
 * Skips over null values
 * @param list The list to format
 * @return {string}
 */
const ListFormat = (list) => {
  const listString = list.filter((item) => item != null).map(String);
  return new Intl.ListFormat("en-GB", { type: "conjunction", style: "long" }).format(listString);
};

export default ListFormat;
