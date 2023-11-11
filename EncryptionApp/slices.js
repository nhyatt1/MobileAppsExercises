import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
    name: 'history',
    initialState: {
        numCiphered: 0,
        //value is related to amount of messages ciphered total
        messages: []
        //message should import as an object: {id, message, shift, type, result}         '
    },
    
    reducers: {
        numCipheredIncrement: state => {
            state.numCiphered += 1;
        },

        numCipheredReset: state => {
            state.numCiphered = 0;
        },

        addMessages: (state, action) => {
            state.messages.push(action.payload);
        },
        removeMessage: (state, action) => {
            state.messages = state.messages.filter(item => item.id !== action.payload);
        },
        clearMessages: state => {
            state.messages = [];
        }
    }
});

export const { numCipheredIncrement, numCipheredReset, addMessages, removeMessage, clearMessages } = historySlice.actions;
export default historySlice.reducer;