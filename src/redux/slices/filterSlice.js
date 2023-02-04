import { createSlice } from '@reduxjs/toolkit';

const defaultValue = {
  homePageFilterEnige: { controls: [], filter: [] },
  booksPageFilterEnige: { controls: [], filter: [] },
  booksPageAdminFilterEnige: { controls: [], filter: [] },
};

const Filter = createSlice({
  name: 'Filter',

  initialState: defaultValue,

  reducers: {
    changeHomePageFilterEnige: (state, action) => {
      state.homePageFilterEnige = action.payload;
    },

    changeBooksPageFilterEnige: (state, action) => {
      state.booksPageFilterEnige = action.payload;
    },

    changeBooksPageAdminFilterEnige: (state, action) => {
      state.booksPageFilterEnige = action.payload;
    },
  },
});

export const filterAction = Filter.actions;
export default Filter.reducer;
