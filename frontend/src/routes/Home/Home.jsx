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
    Menu,
    MenuItem,
    Divider,
    IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

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
    const history = useHistory();
    const location = useLocation();

    const { isAuthenticated } = useSelector((state) => state.auth);

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

    // TODO Limit tab label to 15 characters

    const [databases, setDatabases] = useState([
        {
            _id: "theid",
            address: "howardfamily.ddns.net",
            host: "888888888888888888",
        },
    ]);
    useEffect(() => {
        const identifier = location.pathname.split("/")[1];
        switch (identifier) {
            case "new":
                _setTabValue("new");
                break;
            default:
                if (databases.find((db) => db._id === identifier))
                    _setTabValue(identifier);
                else history.push("/");
                break;
        }
    }, []);

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
                            onClick={() => setTabValue("new")}
                        />
                        <Divider />
                        {databases.map((db) => [
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
                                            <Typography variant="body2">
                                                {db.host || db.address}
                                            </Typography>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                width: "100%",
                                            }}
                                        >
                                            <IconButton size="small">
                                                <FontAwesomeIcon
                                                    icon={faChevronDown}
                                                    size="sm"
                                                />
                                            </IconButton>
                                        </div>
                                    </div>
                                }
                                value={db._id}
                                onClick={() => setTabValue(db._id)}
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
                    <Switch>
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
