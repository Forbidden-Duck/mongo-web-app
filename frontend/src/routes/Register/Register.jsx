import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Typography,
    Card,
    CardHeader,
    CardActionArea,
    CardContent,
    CardActions,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import Button from "../../components/ActionButton/ActionButton";
import TextField from "../../components/FormikTextField/FormikTextField";

import {
    clearError,
    registerUser,
    registerAndLogin,
} from "../../store/auth/Auth.actions";

function Register() {
    const classes = makeStyles((theme) => ({
        app: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100% - 66px)",
        },
        card: {
            width: "400px",
            padding: "15px",
        },
        clearLink: {
            color: "#558db5",
            textDecoration: "none",
        },
    }))();

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const { isAuthenticated, isPending, error } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword(!showPassword);

    // Handle redirect
    const [loggedin, setLoggedIn] = useState(false);
    useEffect(() => {
        if (loggedin && !error && !isPending) {
            history.push("/");
        }
    }, [loggedin, error, isPending]);

    const handleRegister = async (creds, { setFieldValue }) => {
        delete creds.confirmPassword;
        if (isAuthenticated) {
            await dispatch(registerUser(creds));
        } else {
            await dispatch(registerAndLogin(creds));
            setLoggedIn(true);
        }
        // Reset form
        if (setFieldValue) {
            setFieldValue("username", "");
            setFieldValue("email", "");
            setFieldValue("password", "");
            setFieldValue("confirmPassword", "");
        }
    };
    const registerSchema = Yup.object().shape({
        username: Yup.string().required("Username is required"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string().required("Password is required"),
        confirmPassword: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "Password does not match"
        ),
    });
    const formatError = (msg) => {
        switch (msg) {
            case "User not found":
            case "Unauthorized":
                return "Failed to log user in";
            default:
                return msg;
        }
    };

    return (
        <div className={classes.app}>
            <Formik
                initialValues={{
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                }}
                validationSchema={registerSchema}
                validateOnBlur
                onSubmit={handleRegister}
            >
                <Form>
                    <Card className={classes.card} elevation={10}>
                        <CardHeader
                            title="Register"
                            titleTypographyProps={{
                                align: "center",
                                variant: "h4",
                                sx: { fontWeight: "400" },
                            }}
                        />
                        <CardContent>
                            <TextField
                                style={{ width: "100%", marginBottom: "30px" }}
                                name="username"
                                label="Username"
                                id="username-input"
                                autoComplete="username"
                            />
                            <TextField
                                style={{ width: "100%", marginBottom: "30px" }}
                                name="email"
                                label="Email"
                                id="email-input"
                                autoComplete="email"
                            />
                            <TextField
                                style={{ width: "100%", marginBottom: "30px" }}
                                name="password"
                                label="Password"
                                id="password-input"
                                autoComplete="new-password"
                                type={showPassword ? "text" : "password"}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="Toggle password visibility"
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
                            <TextField
                                style={{ width: "100%", marginBottom: "30px" }}
                                name="confirmPassword"
                                label="Confirm Password"
                                id="confirmpassword-input"
                                autoComplete="off"
                                type={showPassword ? "text" : "password"}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="Toggle confirm password visibility"
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
                            {!!error && (
                                <Typography
                                    style={{ color: "red", marginTop: "10px" }}
                                    variant="body2"
                                >
                                    {formatError(error)}
                                </Typography>
                            )}
                            <Typography
                                className={classes.clearLink}
                                component={Link}
                                to={`/login${location.search}`}
                            >
                                Sign in instead?
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                style={{ marginTop: "30px" }}
                                variant="contained"
                                color="primary"
                                type="submit"
                                isLoading={isPending}
                                fullWidth={true}
                                size="large"
                                progressVariant="error"
                            >
                                <Typography variant="body2">
                                    Register
                                </Typography>
                            </Button>
                        </CardActions>
                    </Card>
                </Form>
            </Formik>
        </div>
    );
}

export default Register;
