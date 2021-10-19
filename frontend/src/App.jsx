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
import LoggedInRoute from "./components/LoggedInRoute/LoggedInRoute";

// Routes
import Home from "./routes/Home/Home";
import Login from "./routes/Login/Login";
import Register from "./routes/Register/Register";
import VerifyEmail from "./routes/VerifyEmail/VerifyEmail";
import Settings from "./routes/Settings/Settings";

import { useMediaQuery } from "@mui/material";

function App() {
    const isMobile640 = useMediaQuery("(max-width:640px)");

    return (
        <Router>
            {isMobile640 ? <MobileNavbar /> : <DesktopNavbar />}
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/verify/:token" component={VerifyEmail} />

                <LoggedInRoute exact path="/settings" Component={Settings} />

                <Redirect from="*" to="/" />
            </Switch>
        </Router>
    );
}

export default App;
