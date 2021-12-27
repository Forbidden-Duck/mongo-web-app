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

import bytesToUnit from "../../utils/bytesToUnit";

import {
    clearError,
    getCollections,
} from "../../store/mongodb/Mongodb.actions";

const gridColumns = [
    { field: "name", headerName: "Name", width: 275 },
    { field: "count", headerName: "Count", width: 150 },
    { field: "size", headerName: "Size", width: 150 },
];

/**
 * @typedef {object} ViewCollectionComponentProps
 * @property {object} database
 */

/**
 *
 * @param {ViewCollectionComponentProps} props
 */
function ViewCollectionsComponent(props) {
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
    const { dbid, database } = useParams();
    const history = useHistory();
    const isTooSmall = useMediaQuery("(max-width:415px)");

    const { collectionCache, isPending, error } = useSelector(
        (state) => state.mongodb
    );
    useEffect(() => {
        dispatch(clearError());
        dispatch(
            getCollections({ database: props.database, dbName: database })
        );
    }, [dispatch]);

    const [selected, setSelected] = useState("");
    const handleNewSelected = (model) => {
        setSelected(model[0]);
    };
    const handleDoubleClick = (model) => {
        history.push(`/${dbid}/${database}/${model.id}`);
    };
    const handleRefreshClick = () => {
        dispatch(
            getCollections({ database: props.database, dbName: database })
        );
    };

    return props.database === false ? (
        <Typography style={{ color: "red" }}>
            There was an error loading the database
        </Typography>
    ) : collectionCache && !isPending && !error ? (
        <div className={`${classes.centerFlex} ${classes.gridContainer}`}>
            <div
                className={`${classes.fullWidth} ${classes.elGap}`}
                style={{ marginBottom: "10px" }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!selected}
                    LinkComponent={Link}
                    to={`/${dbid}/${database}/${selected}`}
                >
                    {isTooSmall ? "View" : "View Documents"}
                </Button>
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
                    to={`/${dbid}`}
                >
                    Back
                </Button>
            </div>
            <DataGrid
                className={classes.grid}
                components={{
                    Toolbar: !isTooSmall && GridToolbar,
                }}
                columns={gridColumns}
                rows={collectionCache.map((col, index) => ({
                    id: col.name,
                    name: col.name,
                    count: col.stats.count,
                    size: bytesToUnit(col.stats.size),
                }))}
                rowsPerPageOptions={[10, 25, 50, 100]}
                onSelectionModelChange={handleNewSelected}
                onCellDoubleClick={handleDoubleClick}
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

export default ViewCollectionsComponent;
