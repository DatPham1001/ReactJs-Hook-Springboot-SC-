import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import UserCreate from "../component/userlogin/CreateUser";
import UserDetail from "../component/userlogin/DetailUserLogin";
import EditUser from "../component/userlogin/EditUserLogin";
import UserList from "../component/userlogin/UserList";

export default function UserLoginRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={UserCreate} path={`${path}/create`} />
        <Route component={UserList} path={`${path}/list`} />
        <Route component={EditUser} path={`${path}/:partyId/edit`} />
        <Route component={UserDetail} path={`${path}/:partyId`} />
      </Switch>
    </div>
  );
}
