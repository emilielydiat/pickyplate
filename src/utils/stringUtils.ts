export const capitaliseWord = (str: string | undefined | null): string =>
  typeof str === "string" && str.length > 0
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : "";
