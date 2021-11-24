import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

/**
 * @typedef {object} ViewDatabaseComponentProps
 * @property {object} database
 */

/**
 *
 * @param {ViewDatabaseComponentProps} props
 * @returns
 */
function ViewDatabaseComponent(props) {
    const classes = makeStyles((theme) => ({
        loading: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        },
    }))();

    const { dbid } = useParams();

    // Routes for connecting to database
    // :(

    return props.database === false ? (
        <Typography style={{ color: "red" }}>
            There was an error finding that database
        </Typography>
    ) : (
        <div className={classes.loading}>
            <CircularProgress style={{ marginBottom: "10px" }} />
            <Typography>Loading...</Typography>
        </div>
    );
}

export default ViewDatabaseComponent;
