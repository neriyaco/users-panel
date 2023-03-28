import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/types/user";

export const usersSlice = createSlice({
    name: "users",
    initialState: [] as User[],
    reducers: {
        set: (state, action) => {
            state = action.payload;
            return state;
        },
        add: (state, action) => {
            state.push(action.payload);
            return state;
        },
        update: (state, action) => {
            const { id, name, email, location } = action.payload;
            const user = state.find((user) => user.id === id);
            if (user) {
                user.name = name;
                user.email = email;
                user.location = {
                    ...user.location,
                    ...location
                }
            }
            return state;
        },
        delete: (state, action) => {
            return state.filter((user) => user.id !== action.payload);
        }
    }
});

export const { set: setUsers, add: addUser, update: updateUser, delete: deleteUser } = usersSlice.actions;
export default usersSlice.reducer;