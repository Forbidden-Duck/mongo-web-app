import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as mongodbAPI from "../../api/mongodb";

export const getDatabases = createAsyncThunk(
    "mongodb/getDatabases",
    async (data) => {
        return {
            databases: await mongodbAPI.getDatabases(data),
        };
    }
);

export const getCollections = createAsyncThunk(
    "mongodb/getCollections",
    async (data, dbName) => {
        return {
            collections: await mongodbAPI.getCollections(data, dbName),
        };
    }
);

export const getDocuments = createAsyncThunk(
    "mongodb/getDocuments",
    async (data, dbName, filter) => {
        return {
            documents: await mongodbAPI.getDocuments(data, dbName, filter),
        };
    }
);

export const clearError = createAction("mongodb/clearError");
