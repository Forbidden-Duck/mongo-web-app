import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, CircularProgress, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { clearError, verifyToken } from "../../store/auth/Auth.actions";

function VerifyEmail() {
    const classes = makeStyles((theme) => ({
        app: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100% - 66px)",
        },
        clearLink: {
            color: "#558db5",
            textDecoration: "none",
        },
    }))();

    const dispatch = useDispatch();
    const { token } = useParams();

    const { isPending, error } = useSelector((state) => state.auth);
    const [verify, setVerify] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleVerify = () => {
        dispatch(verifyToken(token));
        setVerify(true);
    };

    return (
        <div className={classes.app}>
            <div style={{ textAlign: "center" }}>
                {verify ? (
                    isPending ? (
                        <>
                            <Typography>Verifying...</Typography>
                            <CircularProgress color="primary" />
                        </>
                    ) : error || hasError ? (
                        <>
                            {/* Logging out would remove the error */}
                            {!hasError && setHasError(true)}{" "}
                            <Typography style={{ color: "red" }}>
                                Failed to verify email
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography>Email has been verified</Typography>
                        </>
                    )
                ) : (
                    <Button
                        style={{ marginBottom: "10px" }}
                        variant="contained"
                        color="primary"
                        fullWidth={true}
                        size="large"
                        onClick={handleVerify}
                    >
                        Verify Email
                    </Button>
                )}
                <Typography
                    className={classes.clearLink}
                    component={Link}
                    to="/"
                >
                    Back to home
                </Typography>
            </div>
        </div>
    );
}

export default VerifyEmail;
