import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 *
 * @param {import("react-router-dom").RouteProps & {Component: any}} props
 */
function LoggedInRoute(props) {
    const { Component, ...rest } = props;
    const { isAuthenticated, isPending } = useSelector((state) => state.auth);
    return (
        <Route
            {...rest}
            render={(renderProps) =>
                isAuthenticated || isPending ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={`/login?redirect=${encodeURIComponent(
                            `${window.location.pathname}${window.location.search}`
                        )}`}
                    />
                )
            }
        />
    );
}

export default LoggedInRoute;
