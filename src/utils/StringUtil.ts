export const truncateString = (str: string, maxLength = 50) => {
  if (!str) return null;
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
};