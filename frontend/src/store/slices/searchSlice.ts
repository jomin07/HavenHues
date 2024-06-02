import { createSlice } from '@reduxjs/toolkit';

interface SearchState {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  hotelID: string;
}

const initialState: SearchState = {
  destination: '',
  checkIn: new Date(),
  checkOut: new Date(),
  adultCount: 1,
  childCount: 0,
  hotelID: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    saveSearchValues(state, action) {
      const { destination, checkIn, checkOut, adultCount, childCount, hotelID } = action.payload;
      state.destination = destination;
      state.checkIn = checkIn;
      state.checkOut = checkOut;
      state.adultCount = adultCount;
      state.childCount = childCount;
      if (hotelID) {
        state.hotelID = hotelID;
      }

      sessionStorage.setItem('destination', destination);
      sessionStorage.setItem('checkIn', checkIn.toISOString());
      sessionStorage.setItem('checkOut', checkOut.toISOString());
      sessionStorage.setItem('adultCount', adultCount.toString());
      sessionStorage.setItem('childCount', childCount.toString());
      if (hotelID) {
        sessionStorage.setItem('hotelID', hotelID);
      }
    },
  },
});

export const { saveSearchValues } = searchSlice.actions;

export default searchSlice.reducer;
