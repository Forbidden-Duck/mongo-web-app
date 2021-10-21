import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
    Typography,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    InputAdornment,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import Button from "../ActionButton/ActionButton";
import TextField from "../FormikTextField/FormikTextField";

import { deleteUser } from "../../store/user/User.actions";

/**
 * @typedef {object} AccountComponentProps
 * @property {boolean} userPending
 * @property {object} user
 * @property {string} [userError]
 */

/**
 *
 * @param {AccountComponentProps} props
 * @returns
 */
function AccountComponent(props) {
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
    const isTinyMobile = useMediaQuery("(max-width:330px)");

    const dispatch = useDispatch();

    const { userPending, userError, user } = props;

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword(!showPassword);

    const handleDeleteUser = async (data) => {
        await dispatch(deleteUser(data.password));
    };
    const formatError = (msg) => {
        switch (msg) {
            case "Unauthorized":
                return "Password is incorrect";
            default:
                return msg;
        }
    };
    const passwordSchema = Yup.object().shape({
        password: Yup.string().required("Password is required"),
    });

    return (
        <Formik
            initialValues={{ password: "" }}
            validationSchema={passwordSchema}
            validateOnBlur
            onSubmit={handleDeleteUser}
        >
            <Form>
                <Card className={classes.card} elevation={10}>
                    {!!userError && (
                        <Typography className={classes.error} variant="body2">
                            {formatError(userError)}
                        </Typography>
                    )}
                    <CardHeader
                        title={isTinyMobile ? "Account" : "Account Settings"}
                        titleTypographyProps={{
                            align: "center",
                            variant: "h4",
                            sx: { fontWeight: "400" },
                        }}
                    />
                    <CardContent>
                        <TextField
                            style={{ width: "100%" }}
                            name="password"
                            label="Password"
                            id="password-input"
                            autoComplete="current-password"
                            type={showPassword ? "text" : "password"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            color="inherit"
                                            onClick={handleShowPassword}
                                        >
                                            {showPassword ? (
                                                <FontAwesomeIcon
                                                    icon={faEye}
                                                    size="sm"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faEyeSlash}
                                                    size="sm"
                                                />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </CardContent>
                    <CardActions>
                        <Button
                            style={{ marginTop: "30px" }}
                            variant="contained"
                            color="error"
                            type="submit"
                            isLoading={userPending}
                            fullWidth={true}
                            size="large"
                            progressVariant="error"
                            disabled={!!user}
                        >
                            <Typography variant="body2">
                                Delete Account
                            </Typography>
                        </Button>
                    </CardActions>
                </Card>
            </Form>
        </Formik>
    );
}

export default AccountComponent;
