import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";

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

import { loginUser } from "./store/auth/Auth.actions";

function App() {
    const isMobile640 = useMediaQuery("(max-width:640px)");

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loginUser());
    }, [dispatch]);

    return (
        <Router>
            {isMobile640 ? <MobileNavbar /> : <DesktopNavbar />}
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/verify/:token" component={VerifyEmail} />

                <LoggedInRoute path="/settings" Component={Settings} />

                {/* If nothing else loads, load home page */}
                <Route path="/" component={Home} />
            </Switch>
        </Router>
    );
}

export default App;
