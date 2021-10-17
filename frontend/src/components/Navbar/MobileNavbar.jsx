import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    Drawer,
    MenuItem,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCog,
    faUserPlus,
    faSignInAlt,
    faSignOutAlt,
    faBars,
} from "@fortawesome/free-solid-svg-icons";
import { logoutUser } from "../../store/auth/Auth.actions";

function MobileNavbar() {
    const classes = makeStyles((theme) => ({
        menuButton: {
            margin: theme.spacing(0.7),
        },
        toolbar: {
            justifyContent: "space-between",
            minHeight: 68,
            background: "#fff",
            color: "#2f2f2f",
        },
        buttonHover: {
            "&:hover": {
                color: "#8f8f8f !important",
            },
        },
        navLogo: {
            backgroundImage:
                "url(https://webassets.mongodb.com/_com_assets/cms/MongoDB_Logo_FullColorBlack_RGB-4td3yuxzjs.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            width: "222px",
            height: "60px",
            "&:hover": {
                cursor: "pointer",
            },
        },
        clearText: {
            color: "inherit",
            textDecoration: "none",
        },
        textPadding: {
            "& *:not(:last-child)": {
                paddingRight: "20px",
            },
        },
    }))();

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Drawer
    const [drawer, setDrawer] = useState(false);
    const handleDrawer = (value) => setDrawer(value ? !!value : !drawer);
    const handleDrawerLogout = async () => {
        handleDrawer(false);
        await dispatch(logoutUser());
    };
    const handleLogoClick = () => history.replace("/");

    return (
        <AppBar
            position="static"
            style={{ position: "relative", zIndex: 1400 }}
        >
            <Toolbar className={classes.toolbar}>
                <div className={classes.navLogo} onClick={handleLogoClick} />
                <div className={classes.menuButton}>
                    <IconButton
                        aria-controls="site-select"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={handleDrawer}
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </IconButton>
                    <Drawer
                        anchor="right"
                        open={drawer}
                        onClose={() => handleDrawer(false)}
                        style={{ zIndex: 1401 }}
                    >
                        <div className={classes.menuButton}>
                            {!isAuthenticated ? (
                                <>
                                    <MenuItem
                                        onClick={() => handleDrawer(false)}
                                        component={Link}
                                        to={`/login${location.search}`}
                                    >
                                        <Typography>
                                            <FontAwesomeIcon
                                                icon={faSignInAlt}
                                            />
                                            &nbsp; Login
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleDrawer(false)}
                                        component={Link}
                                        to={`/register${location.search}`}
                                    >
                                        <Typography>
                                            <FontAwesomeIcon
                                                icon={faUserPlus}
                                            />
                                            &nbsp; Register
                                        </Typography>
                                    </MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem
                                        onClick={() => handleDrawer(false)}
                                        component={Link}
                                        to="/settings"
                                    >
                                        <Typography>
                                            <FontAwesomeIcon icon={faCog} />
                                            &nbsp; Settings
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleDrawerLogout}>
                                        <Typography>
                                            <FontAwesomeIcon
                                                icon={faSignOutAlt}
                                            />
                                            &nbsp; Logout
                                        </Typography>
                                    </MenuItem>
                                </>
                            )}
                        </div>
                    </Drawer>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default MobileNavbar;
