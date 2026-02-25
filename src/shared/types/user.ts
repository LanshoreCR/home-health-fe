export interface UserState {
  employeeId: string
  businessLineId: string
  businessLineName: string
  regionId: string | null
  regionName: string | null
  rdIda: string | null
  rdName: string | null
  edId: string
  edName: string
  locationId: string
  locationName: string
  role?: string[]
}
