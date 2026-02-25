import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserState } from '@shared/types/user'

const initialState: UserState = {
  employeeId: '',
  businessLineId: '',
  businessLineName: '',
  regionId: null,
  regionName: null,
  rdIda: null,
  rdName: null,
  edId: '',
  edName: '',
  locationId: '',
  locationName: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload }
    }
  }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
