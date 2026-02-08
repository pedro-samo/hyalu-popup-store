export function transformDate(dateStr: string): string {
  const parts = dateStr.split("/");
  if (parts.length !== 3) {
    return dateStr;
  }
  const [dd, mm, yyyy] = parts;
  return `${mm}/${dd}/${yyyy}`;
}
