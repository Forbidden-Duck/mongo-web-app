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

import { clearError, loginUser } from "../../store/auth/Auth.actions";

function Login() {
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
        if (isAuthenticated) {
            const redirect = new URLSearchParams(location.search).get(
                "redirect"
            );
            redirect
                ? history.push(decodeURIComponent(redirect))
                : history.push("/");
        }
    }, [isAuthenticated, history, location]);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword(!showPassword);

    const handleLogin = (creds) => {
        dispatch(loginUser(creds));
    };
    const formatError = (msg) => {
        switch (msg) {
            case "User not found":
            case "Unauthorized":
                return "Incorrect email/username or password";
            default:
                return msg;
        }
    };
    const loginSchema = Yup.object().shape({
        username: Yup.string().required("Username or email is required"),
        password: Yup.string().required("Password is required"),
    });

    return (
        <div className={classes.app}>
            <Formik
                initialValues={{ username: "", password: "" }}
                validationSchema={loginSchema}
                validateOnBlur
                onSubmit={handleLogin}
            >
                <Form>
                    <Card className={classes.card} elevation={10}>
                        <CardHeader
                            title="Login"
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
                                label="Username or email"
                                id="username-input"
                                autoComplete="username"
                            />
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
                            <Typography
                                style={{ color: "red", marginTop: "10px" }}
                                variant="body2"
                            >
                                {!!error && formatError(error)}
                            </Typography>
                            <Typography
                                className={classes.clearLink}
                                component={Link}
                                to={`/register${location.search}`}
                            >
                                Sign up instead?
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
                                <Typography variant="body2">Login</Typography>
                            </Button>
                        </CardActions>
                    </Card>
                </Form>
            </Formik>
        </div>
    );
}

export default Login;
