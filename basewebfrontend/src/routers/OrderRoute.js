import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import OrderCreate from "component/order/OrderCreate";
import OrderList from "component/order/OrderList";
import OrderDetail from "component/order/OrderDetail";
import OrderUpdate from "component/order/OrderUpdate";

export default function OrderRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={OrderCreate} path={`${path}/create`} />
        <Route component={OrderList} path={`${path}/list`} />
        <Route component={OrderDetail} path={`${path}/detail/:id`} />
        <Route component={OrderUpdate} path={`${path}/update/:id`} />
      </Switch>
    </div>
  );
}
