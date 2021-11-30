import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
function ViewCollectionComponent(props) {
    return <p>hi</p>;
}

export default ViewCollectionComponent;
