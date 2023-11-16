import { createSlice } from '@reduxjs/toolkit';

const markersSlice = createSlice({
    name: 'markers',
    initialState: {
        numMarkers: 0,
        //value is related to amount of Markers on map
        markerList: []
        //message should import as an object: {id, location, title, description}
    },
    
    reducers: {
        //numciphered is used to determine the id in cipher.js
        numIncrement: state => {
            state.numMarkers += 1;
        },
        numDecrement: state => {
            state.numMarkers -= 1;
        },

        

        addMarker: (state, action) => {
            state.markerList.push(action.payload);
        },
        removeMarker: (state, action) => {
            state.markerList = state.markerList.filter(item => item.id !== action.payload);
        },
    }
});

export const { numIncrement, numDecrement, addMarker, removeMarker } = markersSlice.actions;
export default markersSlice.reducer;