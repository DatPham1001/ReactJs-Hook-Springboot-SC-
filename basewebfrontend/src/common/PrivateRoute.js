import React from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import { Route } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const history = useHistory();

  return (
    <Route
      {...rest}
      render={(props) => {
        return isAuthenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: history.location } }}
          />
        );
      }}
    />
  );
}

export default PrivateRoute;
