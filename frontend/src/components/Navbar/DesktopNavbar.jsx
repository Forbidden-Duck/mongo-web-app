import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserCircle,
    faCog,
    faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { logoutUser } from "../../store/auth/Auth.actions";

function DesktopNavbar() {
    const classes = makeStyles((theme) => ({
        menuButton: {
            marginRight: theme.spacing(2),
            display: "flex",
            alignItems: "center",
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

    // Menu dropdown
    const [menu, setMenu] = useState(null);
    const handleMenuClose = () => setMenu(null);
    const handleMenuClick = (evt) => setMenu(evt.currentTarget);
    const handleMenuLogout = async () => {
        handleMenuClose();
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
                    {!isAuthenticated ? (
                        <div className={classes.textPadding}>
                            <Typography
                                className={`${classes.clearText} ${classes.buttonHover}`}
                                component={Link}
                                to={`/login${location.search}`}
                            >
                                Login
                            </Typography>
                            <Typography
                                className={`${classes.clearText} ${classes.buttonHover}`}
                                component={Link}
                                to={`/register${location.search}`}
                            >
                                Register
                            </Typography>
                        </div>
                    ) : (
                        <>
                            <IconButton
                                aria-controls="site-select"
                                aria-haspopup="true"
                                color="inherit"
                                onClick={handleMenuClick}
                            >
                                <FontAwesomeIcon icon={faUserCircle} />
                            </IconButton>
                            <Menu
                                id="site-select"
                                anchorEl={menu}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                }}
                                open={!!menu}
                                onClose={handleMenuClose}
                                keepMounted
                                style={{ zIndex: 1401 }}
                            >
                                <MenuItem
                                    onClick={handleMenuClose}
                                    component={Link}
                                    to="/settings"
                                >
                                    <Typography>
                                        <FontAwesomeIcon icon={faCog} />
                                        &nbsp;Settings
                                    </Typography>
                                </MenuItem>
                                <MenuItem onClick={handleMenuLogout}>
                                    <Typography>
                                        <FontAwesomeIcon icon={faSignOutAlt} />
                                        &nbsp;Logout
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default DesktopNavbar;
