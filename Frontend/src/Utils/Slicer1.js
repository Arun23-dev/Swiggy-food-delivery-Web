import { createSlice } from '@reduxjs/toolkit'


const cartSlicer = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        count: 0
    },
    reducers: {
        addItem: (state, actions) => {
            state.items.push({ ...actions.payload, quantity: 1 })
            state.count = state.count + 1;


        },
        increseItem: (state, action) => {

            state.count = state.count + 1;
            const item = state.items.find((info) => info.id === action.payload.id)

            if (item) {
                item.quantity += 1;
            }

        },
        decreaseItem: (state, action) => {
            state.count = state.count - 1;
            const item = state.items.find((info) => info.id === action.payload.id)

            if (item.quantity > 1) {
                item.quantity -= 1
            }
            else {
                state.items = state.items.filter(i => i.id !== action.payload.id)
            }

        }
    }
})
export const { addItem, increseItem, decreaseItem } = cartSlicer.actions;
export default cartSlicer.reducer

