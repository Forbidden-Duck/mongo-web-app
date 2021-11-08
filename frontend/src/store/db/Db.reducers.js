import { createSlice } from "@reduxjs/toolkit";
import * as dbActions from "./Db.actions";

const dbSlice = createSlice({
    name: "db",
    initialState: {
        isPending: false,
        error: null,
        dbCache: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Clear error state
            .addCase(dbActions.clearError, (state) => {
                state.error = null;
            })

            // Get all pending
            .addCase(dbActions.getAll.pending, (state) => {
                state.isPending = true;
            })
            // Get all fulfilled
            .addCase(dbActions.getAll.fulfilled, (state, action) => {
                const { dbs } = action.payload;
                state.isPending = false;
                state.error = null;
                for (const db of dbs) {
                    state.dbCache[db._id] = { ...db, saved: true };
                }
            })
            // Get all rejected
            .addCase(dbActions.getAll.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Get db pending
            .addCase(dbActions.getOne.pending, (state) => {
                state.isPending = true;
            })
            // Get db fulfilled
            .addCase(dbActions.getOne.fulfilled, (state, action) => {
                const { db } = action.payload;
                state.isPending = false;
                state.error = null;
                state.dbCache[db._id] = { ...db, saved: true };
            })
            // Get db rejected
            .addCase(dbActions.getOne.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Create db pending
            .addCase(dbActions.createOne.pending, (state) => {
                state.isPending = true;
            })
            // Create db fulfilled
            .addCase(dbActions.createOne.fulfilled, (state, action) => {
                const { db } = action.payload;
                state.isPending = false;
                state.error = null;
                state.dbCache[db._id] = { ...db, saved: true };
            })
            // Create db rejected
            .addCase(dbActions.createOne.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Update db pending
            .addCase(dbActions.updateOne.pending, (state) => {
                state.isPending = true;
            })
            // Update db fulfilled
            .addCase(dbActions.updateOne.fulfilled, (state, action) => {
                const { db } = action.payload;
                state.isPending = false;
                state.error = null;
                state.dbCache[db._id] = { ...db, saved: true };
            })
            // Update db rejected
            .addCase(dbActions.updateOne.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Delete db pending
            .addCase(dbActions.deleteOne.pending, (state) => {
                state.isPending = true;
            })
            // Delete db fulfilled
            .addCase(dbActions.deleteOne.fulfilled, (state, action) => {
                const { dbid } = action.payload;
                state.isPending = false;
                state.error = null;
                delete state.dbCache[dbid];
            })
            // Delete db rejected
            .addCase(dbActions.deleteOne.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            });
    },
});

export default dbSlice.reducer;
