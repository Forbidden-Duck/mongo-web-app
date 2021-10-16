import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as authAPI from "../../api/auth";

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (data) => {
        return {
            user: await authAPI.register({ ...data }),
        };
    }
);

export const loginUser = createAsyncThunk("auth/loginUser", async (data) => {
    return {
        user: await authAPI.login({ ...data }),
    };
});

export const registerAndLogin = createAsyncThunk(
    "auth/registerAndLoginUser",
    async (data) => {
        const user = await authAPI.register({ ...data });
        return {
            user: await authAPI.login({
                username: data.username,
                password: data.password,
            }),
        };
    }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
    await authAPI.logout();
});

export const verifyToken = createAsyncThunk(
    "auth/verifyToken",
    async (token) => {
        await authAPI.verify(token);
    }
);

export const clearError = createAction("auth/clearError");
