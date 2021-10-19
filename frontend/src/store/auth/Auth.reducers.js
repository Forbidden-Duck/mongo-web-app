import { createSlice } from "@reduxjs/toolkit";
import * as authActions from "./Auth.actions";
import { deleteUser } from "../user/User.actions";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isPending: false,
        isAuthenticated: false,
        userid: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Delete user fulfilled
            .addCase(deleteUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.userid = null;
            })

            // Clear error state
            .addCase(authActions.clearError, (state) => {
                state.error = null;
            })

            // Register pending
            .addCase(authActions.registerUser.pending, (state) => {
                state.isPending = true;
            })
            // Register fulfilled
            .addCase(authActions.registerUser.fulfilled, (state) => {
                state.isPending = false;
                state.error = null;
            })
            // Register rejected
            .addCase(authActions.registerUser.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message || true;
            })

            // Login pending
            .addCase(authActions.loginUser.pending, (state) => {
                state.isPending = true;
            })
            // Login fulfilled
            .addCase(authActions.loginUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.isPending = false;
                state.error = null;
                state.isAuthenticated = true;
                state.userid = user._id;
            })
            // Login rejected
            .addCase(authActions.loginUser.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message || true;
            })

            // Register and Login pending
            .addCase(authActions.registerAndLogin.pending, (state) => {
                state.isPending = true;
            })
            // Register and Login fulfilled
            .addCase(
                authActions.registerAndLogin.fulfilled,
                (state, action) => {
                    const { user } = action.payload;
                    state.isPending = false;
                    state.error = null;
                    state.isAuthenticated = true;
                    state.userid = user._id;
                }
            )
            // Register and Login rejected
            .addCase(authActions.registerAndLogin.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message || true;
            })

            // Logout pending
            .addCase(authActions.logoutUser.pending, (state) => {
                state.isPending = true;
            })
            // Logout fulfilled
            .addCase(authActions.logoutUser.fulfilled, (state) => {
                state.isPending = false;
                state.error = null;
                state.isAuthenticated = false;
                state.userid = null;
            })
            // Logout rejected
            .addCase(authActions.logoutUser.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message || true;
                state.isAuthenticated = false;
                state.userid = null;
            })

            // Verify pending
            .addCase(authActions.verifyToken.pending, (state) => {
                state.isPending = true;
            })
            // Verify fulfilled
            .addCase(authActions.verifyToken.fulfilled, (state) => {
                state.isPending = false;
                state.error = null;
            })
            // Verify rejected
            .addCase(authActions.verifyToken.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message || true;
            });
    },
});

export default authSlice.reducer;
