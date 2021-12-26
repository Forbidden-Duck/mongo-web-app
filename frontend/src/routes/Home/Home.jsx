import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
    useHistory,
    useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Tabs,
    Tab,
    Box,
    useMediaQuery,
    Typography,
    MenuItem,
    Divider,
    IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Utils } from "@forbidden_duck/super-mongo";

import ViewRouterComponent from "../../components/HomeComponents/ViewRouterComponent";
import NewDBComponent from "../../components/HomeComponents/NewDBComponent";
import DatabaseMenu from "../../components/HomeComponents/DatabaseMenu";

import {
    clearError,
    getAll,
    addDBs,
    removeDBs,
} from "../../store/db/Db.actions";

function Home() {
    const classes = makeStyles((theme) => ({
        app: {
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            height: "calc(100% - 66px)",
        },
        content: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
        },
        "@media (max-width:530px)": {
            app: {
                flexDirection: "column",
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
              display: "flex",
              flexGrow: 1,
              height: "100%",
              width: "250px",
              borderRight: "solid 1px gray",
          };

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const { isAuthenticated } = useSelector((state) => state.auth);
    const { dbCache } = useSelector((state) => state.db);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated) dispatch(getAll());
    }, [dispatch, isAuthenticated]);

    const [tabValue, _setTabValue] = useState(false);
    const setTabValue = (value) => {
        if (tabValue === value) {
            _setTabValue(false);
            history.push("/");
        } else {
            _setTabValue(value);
            history.push(`/${value}`);
        }
    };

    const limitLabelLength = (label) => {
        if (label.length > 17) return `${label.substring(0, 17)}...`;
        return label;
    };

    useEffect(() => {
        const identifier = location.pathname.split("/")[1];
        switch (identifier) {
            case "new":
                _setTabValue("new");
                break;
            default:
                if (Object.values(dbCache).find((db) => db._id === identifier))
                    _setTabValue(identifier);
                else history.push("/");
                break;
        }
    }, []);

    const handleNewDatabase = (data) => {
        data._id = Utils.ID.create("SHA256");
        dispatch(addDBs([data]));
        setTabValue("");
    };
    const handleDeleteDatabase = (id) => {
        setTabValue("");
        dispatch(removeDBs([id]));
    };

    return (
        <Router>
            <div className={classes.app}>
                <Box sx={boxSX}>
                    <Tabs
                        orientation={isMobile ? "horizontal" : "vertical"}
                        value={tabValue}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        style={{ width: "100%" }}
                    >
                        <Tab
                            label="New"
                            value="new"
                            onClick={() => setTabValue("new")}
                        />
                        <Divider />
                        {Object.values(dbCache).map((db) => [
                            <Tab
                                label={
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            width: "100%",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-start",
                                                width: "100%",
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                onClick={() =>
                                                    setTabValue(db._id)
                                                }
                                            >
                                                {limitLabelLength(
                                                    db.host || db.address
                                                )}
                                            </Typography>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                width: "100%",
                                            }}
                                        >
                                            <DatabaseMenu
                                                id={`${db._id}-select`}
                                                anchorOrigin={{
                                                    vertical: "bottom",
                                                    horizontal: "center",
                                                }}
                                                transformOrigin={{
                                                    vertical: "top",
                                                    horizontal: "center",
                                                }}
                                                keepMounted
                                                database={db}
                                                isAuthenticated={
                                                    isAuthenticated
                                                }
                                                handleDelete={() =>
                                                    handleDeleteDatabase(db._id)
                                                }
                                            />
                                        </div>
                                    </div>
                                }
                                value={db._id}
                                sx={{
                                    textTransform: "unset",
                                    fontSize: ".7em",
                                    fontWeight: "500",
                                }}
                            />,
                            <Divider />,
                        ])}
                    </Tabs>
                </Box>
                <div className={classes.content}>
                    <Switch location={location}>
                        <Route
                            exact
                            path="/new"
                            render={() => (
                                <NewDBComponent onSubmit={handleNewDatabase} />
                            )}
                        />
                        <Route
                            path="/:dbid"
                            render={() => (
                                <ViewRouterComponent
                                    database={dbCache[tabValue]}
                                />
                            )}
                        />
                        <Route
                            path="/"
                            render={() => (
                                <Typography variant="body1">
                                    Select a database or connect to a new one
                                </Typography>
                            )}
                        />
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default Home;
