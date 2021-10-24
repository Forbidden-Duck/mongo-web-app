import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
    Link,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Tabs,
    Tab,
    Box,
    useMediaQuery,
    Typography,
    Menu,
    MenuItem,
    Divider,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

// TODO Component for viewing databases
// TODO Component for adding new databases

import { clearError, getAll } from "../../store/db/Db.actions";

function Home() {
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
              width: "250px",
              borderRight: "solid 1px gray",
          };

    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(clearError());
        dispatch(getAll());
    }, [dispatch]);

    const [tabValue, setTabValue] = useState(false);

    return (
        <Router>
            <div className={classes.app}>
                <Box sx={boxSX}>
                    <Tabs
                        orientation={isMobile ? "horizontal" : "vertical"}
                        value={tabValue}
                    >
                        <Tab
                            label="New"
                            value="new"
                            component={Link}
                            to="/new"
                            onClick={() => setTabValue("new")}
                        />
                        <Divider />
                    </Tabs>
                </Box>
                <div className={classes.content}>
                    <Switch>
                        <Route
                            path="/"
                            render={() => (
                                <Typography variant="body1">
                                    Select a database or connect to a new one
                                </Typography>
                            )}
                        />
                        <Redirect from="*" to="/" />
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default Home;
