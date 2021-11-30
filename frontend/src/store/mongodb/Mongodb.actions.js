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
    async (data) => {
        return {
            collections: await mongodbAPI.getCollections(
                data.database,
                data.dbName
            ),
        };
    }
);

export const getDocuments = createAsyncThunk(
    "mongodb/getDocuments",
    async (data) => {
        return {
            documents: await mongodbAPI.getDocuments(
                data.database,
                data.dbName,
                data.filter
            ),
        };
    }
);

export const clearError = createAction("mongodb/clearError");
