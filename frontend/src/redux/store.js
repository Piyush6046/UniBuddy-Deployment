import { configureStore } from '@reduxjs/toolkit';
import authSlice from "../slices/authSlices";

import hostelReducer from '../slices/hostelSlice';
import mentorReducer from "../slices/mentorSlice";  // ✅ Import Mentor Slice
import foodReducer from "../slices/foodSlice";
import bookReducer from "../slices/booksSlice"
const store = configureStore({
  reducer: {
    auth: authSlice,
    hostel: hostelReducer,
    mentor: mentorReducer,
    food: foodReducer,
    book: bookReducer,
  },
});

export default store;
