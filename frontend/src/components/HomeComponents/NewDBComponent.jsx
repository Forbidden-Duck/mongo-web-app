import React from "react";
import { useDispatch } from "react-redux";
import {
    Button,
    Typography,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Form, Formik } from "formik";
import * as Yup from "yup";

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
    const isTinyMobile = useMediaQuery("(max-width:290px)");

    const dispatch = useDispatch();

    const { onSubmit } = props;

    const handleSubmit = (data) => {
        onSubmit(data);
    };
    const newDBSchema = Yup.object().shape({
        address: Yup.string().required("Address is required"),
        host: Yup.string().required("Host is required"),
        username: Yup.string(),
        password: Yup.string(),
    });

    return (
        <Formik
            initialValues={{
                address: "",
                host: "",
                username: "",
                password: "",
            }}
            validationSchema={newDBSchema}
            onSubmit={handleSubmit}
            validateOnBlur
        >
            <Form>
                <Card className={classes.card} elevation={10}>
                    <CardHeader
                        title={isTinyMobile ? "New DB" : "New Database"}
                        titleTypographyProps={{
                            align: "center",
                            variant: "h4",
                            sx: { fontWeight: "400" },
                        }}
                    />
                    <CardContent>
                        <TextField
                            style={{ width: "100%", marginBottom: "30px" }}
                            name="address"
                            label="Address"
                            id="address-input"
                            autoComplete="off"
                        />
                        <TextField
                            style={{ width: "100%", marginBottom: "30px" }}
                            name="host"
                            label="Host"
                            id="host-input"
                            autoComplete="off"
                        />
                        <TextField
                            style={{ width: "100%", marginBottom: "30px" }}
                            name="username"
                            label="Username"
                            id="username-input"
                            autoComplete="off"
                        />
                        <TextField
                            style={{ width: "100%", marginBottom: "10px" }}
                            name="password"
                            label="Password"
                            id="password-input"
                            autoComplete="off"
                            type="password"
                        />
                    </CardContent>
                    <CardActions>
                        <Button
                            style={{ marginTop: "30px" }}
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth={true}
                            size="large"
                        >
                            <Typography variant="body2">Add</Typography>
                        </Button>
                    </CardActions>
                </Card>
            </Form>
        </Formik>
    );
}

export default NewDBComponent;
