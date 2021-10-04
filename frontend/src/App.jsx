import React from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";

// Components
import DesktopNavbar from "./components/Navbar/DesktopNavbar";
import MobileNavbar from "./components/Navbar/MobileNavbar";

// Routes
import Home from "./routes/Home/Home";

import { useMediaQuery } from "@mui/material";

function App() {
    const isMobile640 = useMediaQuery("(max-width:640px)");

    return (
        <div>
            <Router>
                {isMobile640 ? <MobileNavbar /> : <DesktopNavbar />}
                <Switch>
                    <Route exact path="/" component={Home} />

                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
