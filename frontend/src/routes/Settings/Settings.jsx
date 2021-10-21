import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
    Link,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab, Box, useMediaQuery, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import ProfileComponent from "../../components/SettingsComponents/ProfileComponent";
import AccountComponent from "../../components/SettingsComponents/AccountComponent";
import SecurityComponent from "../../components/SettingsComponents/SecurityComponent";

import { clearError } from "../../store/auth/Auth.actions";
import { getUser } from "../../store/user/User.actions";

function Settings() {
    const classes = makeStyles((theme) => ({
        app: {
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "calc(100% - 66px)",
        },
        content: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
        },
        "@media (max-width:530px)": {
            app: {
                flexDirection: "column",
            },
            content: {
                height: "100%",
            },
        },
    }))();
    const isMobile = useMediaQuery("(max-width:530px)");
    const boxSX = isMobile
        ? {
              width: "100%",
              height: "48px",
              borderBottom: "solid 1px gray",
          }
        : {
              height: "100%",
              width: "100px",
              borderRight: "solid 1px gray",
          };

    const dispatch = useDispatch();

    const {
        user,
        error: userError,
        isPending: userPending,
    } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(clearError());
        dispatch(getUser());
    }, [dispatch]);

    return (
        <Router>
            <div className={classes.app}>
                <Route
                    path="/"
                    render={({ location }) => (
                        <>
                            <Box sx={boxSX}>
                                <Tabs
                                    orientation={
                                        isMobile ? "horizontal" : "vertical"
                                    }
                                    value={location.pathname}
                                >
                                    <Tab
                                        label="Profile"
                                        value="/settings/profile"
                                        component={Link}
                                        to="/settings/profile"
                                    />
                                    <Tab
                                        label="Account"
                                        value="/settings/account"
                                        component={Link}
                                        to="/settings/account"
                                    />
                                    <Tab
                                        label="Security"
                                        value="/settings/security"
                                        component={Link}
                                        to="/settings/security"
                                    />
                                </Tabs>
                            </Box>
                            <div className={classes.content}>
                                <Switch>
                                    <Route
                                        path="/settings/profile"
                                        render={() => (
                                            <ProfileComponent
                                                user={user}
                                                userPending={userPending}
                                                userError={userError}
                                            />
                                        )}
                                    />
                                    <Route
                                        path="/settings/account"
                                        render={() => (
                                            <AccountComponent
                                                user={user}
                                                userPending={userPending}
                                                userError={userError}
                                            />
                                        )}
                                    />
                                    <Route
                                        path="/settings/security"
                                        render={() => (
                                            <SecurityComponent
                                                user={user}
                                                userPending={userPending}
                                                userError={userError}
                                            />
                                        )}
                                    />
                                    <Route
                                        path="/settings/amongus"
                                        render={() => (
                                            <Typography
                                                color="red"
                                                variant="body1"
                                            >
                                                Red lookin pretty sus
                                            </Typography>
                                        )}
                                    />
                                    <Redirect from="*" to="/settings/profile" />
                                </Switch>
                            </div>
                        </>
                    )}
                />
            </div>
        </Router>
    );
}

export default Settings;
