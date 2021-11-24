import { createSlice } from "@reduxjs/toolkit";
import * as mongodbActions from "./Mongodb.actions";

const mongodbSlice = createSlice({
    name: "mongodb",
    initialState: {
        isPending: false,
        error: null,
        databaseCache: [],
        collectionCache: [],
        documentCache: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Clear error state
            .addCase(mongodbActions.clearError, (state) => {
                state.error = null;
            })

            // Get databases pending
            .addCase(mongodbActions.getDatabases.pending, (state) => {
                state.isPending = true;
            })
            // Get databases fulfilled
            .addCase(mongodbActions.getDatabases.fulfilled, (state, action) => {
                const { databases } = action.payload;
                state.isPending = false;
                state.error = null;
                state.databaseCache = databases;
            })
            // Get databases rejected
            .addCase(mongodbActions.getDatabases.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Get collections pending
            .addCase(mongodbActions.getCollections.pending, (state) => {
                state.isPending = true;
            })
            // Get collections fulfilled
            .addCase(
                mongodbActions.getCollections.fulfilled,
                (state, action) => {
                    const { collections } = action.payload;
                    state.isPending = false;
                    state.error = null;
                    state.collectionCache = collections;
                }
            )
            // Get collections rejected
            .addCase(
                mongodbActions.getCollections.rejected,
                (state, action) => {
                    const { message } = action.error;
                    state.isPending = false;
                    state.error = message;
                }
            )

            // Get documents pending
            .addCase(mongodbActions.getDocuments.pending, (state) => {
                state.isPending = true;
            })
            // Get documents fulfilled
            .addCase(mongodbActions.getDocuments.fulfilled, (state, action) => {
                const { documents } = action.payload;
                state.isPending = false;
                state.error = null;
                state.documentCache = documents;
            })
            // Get documents rejected
            .addCase(mongodbActions.getDocuments.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            });
    },
});
