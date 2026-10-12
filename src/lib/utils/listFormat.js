/**
 * Formats the list by printing it as a string using disjunction to join them
 * @param list The list to format
 * @return {string}
 */
const ListFormat = (list) => {
  return new Intl.ListFormat("en-US", { type: "conjunction", style: "long" }).format(list);
};

export default ListFormat;
