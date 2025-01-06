const POWER_BI_REPORT_URL = import.meta.env.VITE_POWER_BI_REPORT_URL ?? ''

export const getReportUrl = (packageId) => {
  return `${POWER_BI_REPORT_URL}${packageId}`
}
