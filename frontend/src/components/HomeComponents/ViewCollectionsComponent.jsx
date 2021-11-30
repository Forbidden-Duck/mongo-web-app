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
        console.log(model.id);
    };

    // Check the responses at any given time
    console.log("c", collectionCache);
    console.log("p", isPending);
    console.log("e", error);
    console.log("s", selected);

    return <p>hi</p>;
}

export default ViewCollectionsComponent;
