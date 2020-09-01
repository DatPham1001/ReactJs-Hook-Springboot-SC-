import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import SupplierCreate from "component/supplier/SupplierCreate";
import SupplierList from "component/supplier/SupplierList";
import SupplierDetail from "component/supplier/SupplierDetail";
import SupplierEdit from "component/supplier/SupplierEdit";

export default function SupplierRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={SupplierList} path={`${path}/list`} />
        <Route component={SupplierCreate} path={`${path}/create`} />
        <Route component={SupplierDetail} exact path={`${path}/detail/:id`} />
        <Route component={SupplierEdit} path={`${path}/edit/:id`} />
      </Switch>
    </div>
  );
}
