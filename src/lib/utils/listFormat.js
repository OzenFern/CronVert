/**
 * Formats the list by printing it as a string using conjunction to join them
 * Use en-GB to avoid a comma before conjunction
 * Skips over null and deduplicate values
 * @param list The list to format
 * @return {string}
 */
const ListFormat = (list) => {
  const listString = list.filter((item) => item != null).map(String);
  const uniqueList = [...new Set(listString)];
  return new Intl.ListFormat("en-GB", { type: "conjunction", style: "long" }).format(uniqueList);
};

export default ListFormat;
