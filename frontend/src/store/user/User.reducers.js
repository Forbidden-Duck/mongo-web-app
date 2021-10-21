import { createSlice } from "@reduxjs/toolkit";
import * as userActions from "./User.actions";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isPending: false,
        error: null,
        user: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Clear error state
            .addCase(userActions.clearError, (state) => {
                state.error = null;
            })

            // Get user pending
            .addCase(userActions.getUser.pending, (state) => {
                state.isPending = true;
            })
            // Get user fulfilled
            .addCase(userActions.getUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.isPending = false;
                state.error = null;
                state.user = user;
            })
            // Get user rejected
            .addCase(userActions.getUser.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
                state.user = null;
            })

            // Update user pending
            .addCase(userActions.updateUser.pending, (state) => {
                state.isPending = true;
            })
            // Update user fulfilled
            .addCase(userActions.updateUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.isPending = false;
                state.error = null;
                state.user = user;
            })
            // Update user rejected
            .addCase(userActions.updateUser.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Delete user pending
            .addCase(userActions.deleteUser.pending, (state) => {
                state.isPending = true;
                state.user = null;
            })
            // Delete user fulfilled
            .addCase(userActions.deleteUser.fulfilled, (state) => {
                state.isPending = false;
                state.error = null;
            })
            // Delete user rejected
            .addCase(userActions.deleteUser.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            });
    },
});

export default userSlice.reducer;
