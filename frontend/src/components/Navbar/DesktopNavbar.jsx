import React from "react";
import "./NavbarStyles.css";

import { AppBar, Toolbar } from "@mui/material";
import { makeStyles } from "@mui/styles";

function DesktopNavbar() {
    const classes = makeStyles((theme) => ({
        menuButton: {
            marginRight: theme.spacing(2),
            display: "flex",
            alignItems: "center",
        },
    }))();

    return (
        <AppBar position="static">
            <Toolbar className="navbar-header">
                <div className="navbar-header-items">
                    <div className="navbar-logo" />
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default DesktopNavbar;
