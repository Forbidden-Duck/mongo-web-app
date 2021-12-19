import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    CircularProgress,
    Typography,
    useMediaQuery,
    Button,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";

import objectMap from "../../utils/objectMap";

import { clearError, getDocuments } from "../../store/mongodb/Mongodb.actions";

/**
 * @typedef {object} ViewDocumentComponentProps
 * @property {object} database
 */

/**
 *
 * @param {ViewDocumentComponentProps} props
 */
function ViewDocumentsComponent(props) {
    const classes = makeStyles((theme) => ({
        centerFlex: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        },
        fullWidth: {
            width: "90%",
        },
        elGap: {
            "& *:not(:last-child)": {
                marginRight: "5px",
            },
        },
        gridContainer: {
            width: "100%",
            height: "90%",
        },
        grid: {
            background: "white",
            color: "inherit",
            padding: "0px 10px",
            width: "90%",
        },
    }))();

    const dispatch = useDispatch();
    const { dbid, database, collection } = useParams();
    const history = useHistory();
    const isTooSmall = useMediaQuery("(max-width:415px)");

    const { documentCache, isPending, error } = useSelector(
        (state) => state.mongodb
    );
    useEffect(() => {
        dispatch(clearError());
        dispatch(
            getDocuments({
                database: props.database,
                dbName: database,
                collName: collection,
                filter: {
                    limit: 100000,
                },
            })
        );
    }, [dispatch]);

    const handleRefreshClick = () => {
        dispatch(
            getDocuments({
                database: props.database,
                dbName: database,
                collName: collection,
            })
        );
    };

    // Check the responses at any given time
    console.log("c", documentCache);
    console.log("p", isPending);
    console.log("e", error);

    return props.database === false ? (
        <Typography style={{ color: "red" }}>
            There was an error loading the database
        </Typography>
    ) : documentCache && !isPending && !error ? (
        <div className={`${classes.centerFlex} ${classes.gridContainer}`}>
            <div
                className={`${classes.fullWidth} ${classes.elGap}`}
                style={{ marginBottom: "10px" }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRefreshClick}
                >
                    Refresh
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    LinkComponent={Link}
                    to={`/${dbid}/${database}`}
                >
                    Back
                </Button>
            </div>
            <DataGrid
                className={classes.grid}
                components={{
                    Toolbar: !isTooSmall && GridToolbar,
                }}
                columns={Object.keys(objectMap(documentCache[0])).map(
                    (key) => ({
                        field: key,
                        headerName: key,
                        width: key.length >= 15 ? 200 : 150,
                    })
                )}
                rows={documentCache.map((doc) => ({
                    id: doc._id,
                    ...objectMap(doc),
                }))}
                rowsPerPageOptions={[10, 25, 50, 100]}
            />
        </div>
    ) : error ? (
        <div className={classes.centerFlex}>
            <Typography>
                There was an error when connecting to the database
            </Typography>
            <Typography style={{ color: "red" }}>{error}</Typography>
        </div>
    ) : (
        <div className={classes.centerFlex}>
            <CircularProgress style={{ marginBottom: "10px" }} />
            <Typography>Loading...</Typography>
        </div>
    );
}

export default ViewDocumentsComponent;
