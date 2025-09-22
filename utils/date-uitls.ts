export const formatDateTime = (isoString: string | null) => {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
