import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
    setUser: (state, action) => {
      const newUser = action.payload
      return {
        ...state,
        ...newUser
      }
    }
  }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
