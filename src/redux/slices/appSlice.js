import { createSlice } from '@reduxjs/toolkit';

const defaultValue = {
  isLoadingApp: false, //loading of app
  history: [],
  menus: [],
  isInPrivateAddress: false,
};

const App = createSlice({
  name: 'App',

  initialState: defaultValue,

  reducers: {
    toggleLoading: (state, action) => {
      state.isLoadingApp = action.payload;
    },

    changeHistory: (state, action) => {
      state.history = action.payload;
    },

    changeDataMenus: (state, action) => {
      state.menus = action.payload;
    },

    changeInPrivateAddresss: (state, action) => {
      state.isInPrivateAddress = action.payload;
    },
  },
});

export const appAction = App.actions;
export default App.reducer;
