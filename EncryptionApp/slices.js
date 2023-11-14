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
        //numciphered is used to determine the id in cipher.js
        numCipheredIncrement: state => {
            state.numCiphered += 1;
        },
        numCipheredDecrement: state => {
            state.numCiphered -= 1;
        },

        

        addMessages: (state, action) => {
            state.messages.push(action.payload);
        },
        removeMessage: (state, action) => {
            state.messages = state.messages.filter(item => item.id !== action.payload);
        },
    }
});

export const { numCipheredIncrement, numCipheredDecrement, addMessages, removeMessage } = historySlice.actions;
export default historySlice.reducer;