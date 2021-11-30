import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
    useHistory,
    useLocation,
} from "react-router-dom";
import ViewDatabaseComponent from "../../components/HomeComponents/ViewDatabaseComponent";
import ViewCollectionsComponent from "../../components/HomeComponents/ViewCollectionComponent";

function ViewRouterComponent(props) {
    return (
        <Router>
            <Switch>
                <Route
                    exact
                    path="/:dbid"
                    render={() => (
                        <ViewDatabaseComponent
                            database={props.database || false}
                        />
                    )}
                />
                <Route
                    exact
                    path="/:dbid/:collection"
                    render={() => (
                        <ViewCollectionsComponent
                            database={props.database || false}
                        />
                    )}
                />
                <Redirect from="/:dbid/*" to="/:dbid" />
            </Switch>
        </Router>
    );
}

export default ViewRouterComponent;
