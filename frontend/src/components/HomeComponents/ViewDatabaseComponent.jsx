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

import { clearError, getDatabases } from "../../store/mongodb/Mongodb.actions";

const gridColumns = [
    { field: "name", headerName: "Name", width: 275 },
    { field: "sizeOnDisk", headerName: "Size", width: 200 },
];

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
    const { dbid } = useParams();
    const history = useHistory();
    const isTooSmall = useMediaQuery("(max-width:415px)");

    const { databaseCache, isPending, error } = useSelector(
        (state) => state.mongodb
    );
    useEffect(() => {
        dispatch(clearError());
        dispatch(getDatabases(props.database));
    }, [dispatch]);

    const [selected, setSelected] = useState("");
    const handleNewSelected = (model) => {
        setSelected(model[0]);
    };
    const handleDoubleClick = (model) => {
        history.push(`/${dbid}/${model.id}`);
    };
    const handleRefreshClick = () => {
        dispatch(getDatabases(props.database));
    };

    return props.database === false ? (
        <Typography style={{ color: "red" }}>
            There was an error finding that database
        </Typography>
    ) : databaseCache && !isPending && !error ? (
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
                    to={`/${dbid}/${selected}`}
                >
                    {isTooSmall ? "View" : "View Collections"}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRefreshClick}
                >
                    Refresh
                </Button>
            </div>
            <DataGrid
                className={classes.grid}
                components={{
                    Toolbar: !isTooSmall && GridToolbar,
                }}
                columns={gridColumns}
                rows={databaseCache.databases.map((db, index) => ({
                    id: db.name,
                    name: db.name,
                    sizeOnDisk: bytesToUnit(db.sizeOnDisk),
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

export default ViewDatabaseComponent;
