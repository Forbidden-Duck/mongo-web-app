import React from "react";
import { useDispatch } from "react-redux";
import {
    Typography,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Form, Formik } from "formik";

import Button from "../ActionButton/ActionButton";
import TextField from "../FormikTextField/FormikTextField";

/**
 * @typedef {object} NewDBComponentProps
 * @property {function} onSubmit
 */

/**
 *
 * @param {NewDBComponentProps} props
 * @returns {JSX.Element}
 */
function NewDBComponent(props) {
    const classes = makeStyles((theme) => ({
        card: {
            maxWidth: "400px",
            padding: "15px",
        },
        error: {
            textAlign: "center",
            background: "rgba(255,0,0,.5)",
            width: "100%",
            fontWeight: 500,
        },
    }))();
    const isTinyMobile = useMediaQuery("(max-width:300px)");

    const dispatch = useDispatch();

    const { onSubmit } = props;

    const handleSubmit = (data) => {
        onSubmit(data);
    };

    return <p>test</p>;
}

export default NewDBComponent;
