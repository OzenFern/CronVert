const LIST_FORMAT = new Intl.ListFormat("en-GB", {
  type: "conjunction",
  style: "long",
});

type ListItem = string | number | null | undefined;

/**
 * Formats the list by printing it as a string using conjunction to join them
 * Use en-GB to avoid a comma before conjunction
 * Skips over null and deduplicate values
 * @param list The list to format
 * @return {string}
 */
const ListFormat = (list: ListItem[]): string => {
  const listString: string[] = list.filter((item: ListItem): boolean => item != null).map(String);
  const uniqueList: string[] = [...new Set(listString)];
  return LIST_FORMAT.format(uniqueList);
};

export default ListFormat;
