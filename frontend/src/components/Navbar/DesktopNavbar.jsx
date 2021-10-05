import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

function DesktopNavbar() {
    const classes = makeStyles((theme) => ({
        menuButton: {
            marginRight: theme.spacing(2),
            display: "flex",
            alignItems: "center",
            "& *:not(:last-child)": {
                paddingRight: "20px",
            },
        },
        toolbar: {
            justifyContent: "space-between",
            minHeight: 68,
            background: "#fff",
            color: "#2f2f2f",
        },
        toolbarItems: {
            display: "flex",
            alignItems: "center",
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
            width: "100vw",
            height: "60px",
        },
        clearText: {
            color: "inherit",
            textDecoration: "none",
        },
    }))();

    return (
        <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                <div className={classes.navLogo} />
                <div className={classes.menuButton}>
                    <Typography
                        className={`${classes.clearText} ${classes.buttonHover}`}
                        component={Link}
                        to={"/login"}
                    >
                        Login
                    </Typography>
                    <Typography
                        className={`${classes.clearText} ${classes.buttonHover}`}
                        component={Link}
                        to={"/register"}
                    >
                        Register
                    </Typography>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default DesktopNavbar;
