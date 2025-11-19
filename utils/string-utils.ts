export const truncateString = (value: string, length: number) => {
  if (!value) return "";
  if (value.length > length) return value.slice(0, length) + "...";
  return value;
};
