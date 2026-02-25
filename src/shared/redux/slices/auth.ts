import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  token: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    }
  }
})

export const { setToken } = authSlice.actions
export default authSlice.reducer
