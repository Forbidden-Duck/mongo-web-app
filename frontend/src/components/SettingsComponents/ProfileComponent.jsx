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

import { resend } from "../../api/auth";
import { updateUser } from "../../store/user/User.actions";

/**
 * @typedef {object} ProfileComponentProps
 * @property {boolean} userPending
 * @property {object} user
 * @property {string} [userError]
 */

/**
 *
 * @param {ProfileComponentProps} props
 * @returns
 */
function ProfileComponent(props) {
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
        resend: {
            color: "#558db5",
            textDecoration: "none",
            "&:hover": {
                cursor: "pointer",
            },
        },
    }))();
    const isTinyMobile = useMediaQuery("(max-width:300px)");

    const dispatch = useDispatch();

    const { userPending, userError, user } = props;

    const handleUpdateUser = async (data, { setFieldValue }) => {
        if (!data.username && !data.email) return;
        if (data.username.length === 0) delete data.username;
        if (data.email.length === 0) delete data.email;
        await dispatch(
            updateUser({ username: data.username, email: data.email })
        );
        setFieldValue("username", "");
        setFieldValue("email", "");
    };
    const handleResend = () => {
        try {
            resend();
        } catch (err) {}
    };

    return (
        <Formik
            initialValues={{ username: "", email: "" }}
            validateOnBlur
            onSubmit={handleUpdateUser}
        >
            <Form>
                <Card className={classes.card} elevation={10}>
                    {!!userError && (
                        <Typography className={classes.error} variant="body2">
                            {userError}
                        </Typography>
                    )}
                    <CardHeader
                        title={isTinyMobile ? "Profile" : "Profile Settings"}
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
                            autoComplete="off"
                            placeholder={user?.username || "Loading..."}
                        />
                        <TextField
                            style={{ width: "100%", marginBottom: "10px" }}
                            name="email"
                            label="Email"
                            id="email-input"
                            autoComplete="off"
                            placeholder={user?.email || "Loading..."}
                        />
                        {user?.verified === false && (
                            <Typography
                                className={classes.resend}
                                onClick={handleResend}
                            >
                                Resend Email
                            </Typography>
                        )}
                    </CardContent>
                    <CardActions>
                        <Button
                            style={{ marginTop: "30px" }}
                            variant="contained"
                            color="primary"
                            type="submit"
                            isLoading={userPending}
                            fullWidth={true}
                            size="large"
                            progressVariant="error"
                            disabled={!user}
                        >
                            <Typography variant="body2">Save</Typography>
                        </Button>
                    </CardActions>
                </Card>
            </Form>
        </Formik>
    );
}

export default ProfileComponent;
