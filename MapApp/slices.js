import { createSlice } from '@reduxjs/toolkit';

const markerSlice = createSlice({
    name: 'marker',
    initialState: {
        numMarkers: 0,
        //value is related to amount of Markers on map
        messages: []
        //message should import as an object: {id, title, description}         '
    },
    
    reducers: {
        //numciphered is used to determine the id in cipher.js
        markerIncrement: state => {
            state.numMarkers += 1;
        },
        markersDecrement: state => {
            state.numMarkers -= 1;
        },

        

        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        removeMessage: (state, action) => {
            state.messages = state.messages.filter(item => item.id !== action.payload);
        },
    }
});

export const { markerIncrement, markersDecrementDecrement, addMessage, removeMessage } = markerSlice.actions;
export default markerSlice.reducer;