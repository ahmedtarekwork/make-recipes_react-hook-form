import { DateType } from "../types";

export default (dateString: string): DateType => {
  const date = new Date(dateString)
    .toLocaleDateString()
    .split("/")
    .reverse()
    .map((n) => (n.length === 1 ? "0" + n : n));

  return [date[0], ...date.slice(1).reverse()].join("-") as DateType;
};
