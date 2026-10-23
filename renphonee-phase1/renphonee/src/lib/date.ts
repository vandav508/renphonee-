// Batas hari/bulan mengikuti WIB (UTC+7), bukan jam server.
const WIB = 7 * 3600e3;
export const startOfDayWIB = (d = new Date()) => new Date(Math.floor((d.getTime() + WIB) / 864e5) * 864e5 - WIB);
export const startOfMonthWIB = (d = new Date()) => {
  const w = new Date(d.getTime() + WIB);
  return new Date(Date.UTC(w.getUTCFullYear(), w.getUTCMonth(), 1) - WIB);
};
export const fmtDate = (d: Date) =>
  d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
