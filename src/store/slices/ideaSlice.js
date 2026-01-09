// src/slices/ideaSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedIdeaId: null,
  roadmapData: null,
};

const ideaSlice = createSlice({
  name: 'idea',
  initialState,
  reducers: {
    setSelectedIdeaId: (state, action) => {
      state.selectedIdeaId = action.payload;
    },
    setRoadmapData: (state, action) => {
      state.roadmapData = action.payload;
    },
  },
});

export const { setSelectedIdeaId, setRoadmapData } = ideaSlice.actions;

export default ideaSlice.reducer;
