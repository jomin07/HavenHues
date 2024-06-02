import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  isAdminLoggedIn: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  isAdminLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
    adminLogin(state) {
      state.isAdminLoggedIn = true;
    },
    adminLogout(state) {
      state.isAdminLoggedIn = false;
    },
  },
});

export const { login, logout, adminLogin, adminLogout } = authSlice.actions;

export default authSlice.reducer;
