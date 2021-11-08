import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as dbAPI from "../../api/db";

export const getAll = createAsyncThunk("db/getAll", async () => {
    return {
        dbs: await dbAPI.all(),
    };
});

export const getOne = createAsyncThunk("db/getOne", async (data) => {
    return {
        db: await dbAPI.get(data),
    };
});

export const createOne = createAsyncThunk("db/createOne", async (data) => {
    return {
        db: await dbAPI.create(data),
    };
});

export const updateOne = createAsyncThunk("db/updateOne", async (data) => {
    return {
        db: await dbAPI.update(data),
    };
});

export const deleteOne = createAsyncThunk("db/deleteOne", async (data) => {
    await dbAPI.delete1(data);
    return {
        dbid: data.id,
    };
});

export const clearError = createAction("db/clearError");

export const addDBs = createAction("db/addDBs");

export const removeDBs = createAction("db/removeDBs");
