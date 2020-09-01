import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import { updateSelectedFuction } from "../action";
import PrivateRoute from "../common/PrivateRoute";
import { Home } from "../component";
import error from "../component/common/ErrorNotFound";
import Loading from "../component/common/Loading";
import { mapPathMenu } from "../config/MenuConfig";
import { Layout } from "../layout";

const SupplierRoute = lazy(() => import("./SupplierRoute"));
const ProductRoute = lazy(() => import("./ProductRouter"));
const CategoryRoute = lazy(() => import("./CategoryRouter"));
const CustomerRoute = lazy(() => import("./CustomerRouter"));
const OrderRoute = lazy(() => import("./OrderRoute"));
const UserLoginRoute = lazy(() => import("./UserLoginRoute"));

function MainAppRoute(props) {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "") {
      dispatch(updateSelectedFuction(null));
    }

    let selectedFunction = mapPathMenu.get(location.pathname);

    if (selectedFunction !== undefined && selectedFunction !== null) {
      dispatch(updateSelectedFuction(selectedFunction));
    }
  }, [location]);

  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Switch>
          <PrivateRoute component={Home} layout={Layout} exact path="/" />

          <PrivateRoute component={UserLoginRoute} path="/userlogin" />

          <PrivateRoute component={OrderRoute} path="/orders" />
          <PrivateRoute component={ProductRoute} path="/products" />
          <PrivateRoute component={CategoryRoute} path="/category"/>
          <PrivateRoute component={CustomerRoute} path="/customer" />

          <PrivateRoute component={SupplierRoute} path="/supplier" />

          <Route component={error} path="*" />
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default MainAppRoute;
