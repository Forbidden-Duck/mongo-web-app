import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as userAPI from "../../api/user";

export const getUser = createAsyncThunk("user/getUser", async () => {
    return {
        user: await userAPI.get(),
    };
});

export const updateUser = createAsyncThunk("user/updateUser", async (data) => {
    return {
        user: await userAPI.update(data),
    };
});

export const deleteUser = createAsyncThunk(
    "api/deleteUser",
    async (password) => {
        await userAPI.delete1({ password });
    }
);

export const clearError = createAction("user/clearError");
