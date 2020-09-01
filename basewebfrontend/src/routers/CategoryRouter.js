import React from "react";
import Category from "../component/product/Category.js";
import { Route, Switch, useRouteMatch } from "react-router";
export default function ProductRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={Category} exact path={`${path}/`} />
      </Switch>
    </div>
  );
}