const POWER_BI_REPORT_URL = import.meta.env.VITE_POWER_BI_REPORT_URL ?? ''

export const getReportUrl = (packageId, businessLine) => {
  return `${POWER_BI_REPORT_URL}?rp:PackageID=${packageId}&rp:BusinessLine=${businessLine}`
}
