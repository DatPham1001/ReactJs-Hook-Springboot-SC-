import React from "react";
import Product from "../component/product/Product.js";
import { Route, Switch, useRouteMatch } from "react-router";
import ProductDetail from "component/product/ProductDetail.js";
import ProductCreate from "component/product/ProductCreate.js";

export default function ProductRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={ProductCreate} exact path={`${path}/create`} />
        <Route component={Product} exact path={`${path}/list`} />
        <Route component = {ProductDetail} exact path={`${path}/detail/:id`}/>
        {/* <Route component={ProductDetail} path={`${path}/:productId`} /> */}
      </Switch>
    </div>
  );
}
