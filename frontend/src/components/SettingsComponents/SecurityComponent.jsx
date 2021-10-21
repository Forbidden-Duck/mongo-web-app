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

import { updateUser } from "../../store/user/User.actions";

/**
 * @typedef {object} SecurityComponentProps
 * @property {boolean} userPending
 * @property {object} user
 * @property {string} [userError]
 */

/**
 *
 * @param {SecurityComponentProps} props
 * @returns
 */
function SecurityComponent(props) {
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
        warning: {
            textAlign: "center",
            background: "rgba(255,140,4,.5)",
            width: "100%",
            fontWeight: 500,
        },
    }))();
    const isTinyMobile = useMediaQuery("(max-width:320px)");

    const dispatch = useDispatch();

    const { userPending, userError, user } = props;

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const handleShowCurrentPassword = () =>
        setShowCurrentPassword(!showCurrentPassword);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const handleShowNewPassword = () => setShowNewPassword(!showNewPassword);

    const handleUpdateUser = async (data, { setFieldValue }) => {
        if (!data.newPassword) return;
        await dispatch(
            updateUser({
                password: data.newPassword,
                currentPassword: data.currentPassword,
            })
        );
        setFieldValue("newPassword", "");
        setFieldValue("confirmNewPassword", "");
        setFieldValue("currentPassword", "");
    };
    const formatError = (msg) => {
        switch (msg) {
            case "Unauthorized":
                return "Current password is incorrect";
            default:
                return msg;
        }
    };
    const passwordSchema = Yup.object().shape({
        newPassword: Yup.string(),
        confirmNewPassword: Yup.string().test(
            "match-password",
            "Does not match new password",
            function (value) {
                return this.parent.newPassword === value;
            }
        ),
        currentPassword: Yup.string().test(
            "password-required",
            "Current password is required",
            function (value) {
                return !this.parent.newPassword || this.parent.currentPassword;
            }
        ),
    });

    return (
        <Formik
            initialValues={{
                newPassword: "",
                confirmNewPassword: "",
                currentPassword: "",
            }}
            validationSchema={passwordSchema}
            validateOnBlur
            onSubmit={handleUpdateUser}
        >
            <Form>
                <Card className={classes.card} elevation={10}>
                    {user && !user.verified && (
                        <Typography className={classes.warning} variant="body2">
                            Your email is not verified
                        </Typography>
                    )}
                    {!!userError && (
                        <Typography className={classes.error} variant="body2">
                            {formatError(userError)}
                        </Typography>
                    )}
                    <CardHeader
                        title={isTinyMobile ? "Security" : "Security Settings"}
                        titleTypographyProps={{
                            align: "center",
                            variant: "h4",
                            sx: { fontWeight: "400" },
                        }}
                    />
                    <CardContent>
                        <TextField
                            style={{ width: "100%", marginBottom: "10px" }}
                            name="newPassword"
                            label="New Password"
                            id="newpassword-input"
                            autoComplete="new-password"
                            type={showNewPassword ? "text" : "password"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle new password visibility"
                                            color="inherit"
                                            onClick={handleShowNewPassword}
                                        >
                                            {showNewPassword ? (
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
                            disabled={user && !user.verified}
                        />
                        <TextField
                            style={{ width: "100%", marginBottom: "30px" }}
                            name="confirmNewPassword"
                            label="Confirm New Password"
                            id="confirmnewpassword-input"
                            autoComplete="off"
                            type={showNewPassword ? "text" : "password"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle new password visibility"
                                            color="inherit"
                                            onClick={handleShowNewPassword}
                                        >
                                            {showNewPassword ? (
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
                            disabled={user && !user.verified}
                        />
                        <TextField
                            style={{ width: "100%" }}
                            name="currentPassword"
                            label="Current Password"
                            id="currentpassword-input"
                            autoComplete="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle current password visibility"
                                            color="inherit"
                                            onClick={handleShowCurrentPassword}
                                        >
                                            {showCurrentPassword ? (
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
                            disabled={user && !user.verified}
                        />
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
                            disabled={(user && !user.verified) || !user}
                        >
                            <Typography variant="body2">
                                Change Password
                            </Typography>
                        </Button>
                    </CardActions>
                </Card>
            </Form>
        </Formik>
    );
}

export default SecurityComponent;
