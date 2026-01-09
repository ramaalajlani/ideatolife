// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import roadmapReducer from "./slices/roadmapSlice";

export const store = configureStore({
  reducer: {
    roadmap: roadmapReducer,
  },
});

export default store;