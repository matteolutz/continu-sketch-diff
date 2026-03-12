/**
 * Removes any \n or \r characters from the string.
 */
export const removeNewlines = (str: string): string => {
  return str.replace(/[\n\r]/g, "");
};
