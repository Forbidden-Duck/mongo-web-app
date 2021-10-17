import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, CircularProgress } from "@mui/material";
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
    const [pended, setPended] = useState(false);
    const [verify, setVerify] = useState(false);

    useEffect(() => {
        dispatch(clearError());
        dispatch(verifyToken(token));
    }, [dispatch, token]);

    useEffect(() => {
        if (!pended && !isPending) {
            setPended(true);
        } else if (pended && !isPending) {
            setVerify(true);
        }
    }, [isPending, setVerify, setPended, pended]);

    return (
        <div className={classes.app}>
            <div style={{ textAlign: "center" }}>
                {verify ? (
                    <>
                        {error ? (
                            <>
                                <Typography style={{ color: "red" }}>
                                    Failed to verify email
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Typography>Email has been verified</Typography>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <Typography>Verifying...</Typography>
                        <CircularProgress color="primary" />
                    </>
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
