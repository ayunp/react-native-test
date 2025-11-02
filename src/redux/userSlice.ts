import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name?: string;
  email?: string;
  picture?: string;
  username?: string;
  token?: string | null;
}

const initialState: UserState = {
  name: '',
  email: '',
  picture: '',
  username: '',
  token: null
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {Object.assign(state, action.payload)},
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions; 
export default userSlice.reducer