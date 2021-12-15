import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from "react-router-dom";
import ViewDatabaseComponent from "../../components/HomeComponents/ViewDatabaseComponent";
import ViewCollectionsComponent from "./ViewCollectionsComponent";
import ViewDocumentsComponent from "./ViewDocumentsComponent";

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
                    path="/:dbid/:database"
                    render={() => (
                        <ViewCollectionsComponent
                            database={props.database || false}
                        />
                    )}
                />
                <Route
                    exact
                    path="/:dbid/:database/:collection"
                    render={() => (
                        <ViewDocumentsComponent
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
