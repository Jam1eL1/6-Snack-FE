import { formatInTimeZone } from "date-fns-tz";

export const formatDate = (date: string) => {
  return formatInTimeZone(date, "America/Vancouver", "yyyy.MM.dd");
};
