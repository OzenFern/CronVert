/**
 * Formats the list by printing it as a string using conjunction to join them
 * Use en-GB to avoid a comma before conjunction
 * Skips over null and deduplicate values
 * @param list The list to format
 * @return {string}
 */
const LIST_FORMAT = new Intl.ListFormat("en-GB", { type: "conjunction", style: "long" });

const ListFormat = (list) => {
  const listString = list.filter((item) => item != null).map(String);
  const uniqueList = [...new Set(listString)];
  return LIST_FORMAT.format(uniqueList);
};

export default ListFormat;
