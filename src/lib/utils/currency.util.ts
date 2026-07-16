const cadCurrencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (amountInCents: number | undefined | null): string => {
  return cadCurrencyFormatter.format((amountInCents ?? 0) / 100);
};

export const dollarsToCents = (amountInDollars: number | string): number => {
  const normalizedAmount =
    typeof amountInDollars === "string" ? Number(amountInDollars.replace(/,/g, "")) : amountInDollars;

  if (!Number.isFinite(normalizedAmount)) return 0;

  return Math.round(normalizedAmount * 100);
};

export const centsToDollars = (amountInCents: number): number => amountInCents / 100;

export const formatDollarInput = (amountInDollars: number): string => {
  return amountInDollars.toLocaleString("en-CA", {
    maximumFractionDigits: 2,
  });
};
// export const formatPrice = (price: number | undefined | null): string => {
//   if (price === undefined || price === null) return "0";
//   return price.toLocaleString("en-CA");
// };
