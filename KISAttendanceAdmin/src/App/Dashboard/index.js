import React from "react";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";
import Dashboard from "./routes/Dashboard";
import AllNotification from "./routes/AllNotification";
import Thought from "./routes/Thought";
// import Sidebar from "../Layouts/Sidebar";
import Header from "../Layouts/Header";

function DashboardRoutes(props) {
  const { path } = useRouteMatch();
  return (
    <div className="main_wrapper">
      {/* <Sidebar /> */}
      <Header />
      <Switch>
        <Redirect exact from={`${path}`} to={`${path}`} />
        <Route path="/dashboard/home" component={Dashboard} />
        <Route path="/dashboard/notification" component={AllNotification} />
        <Route path="/dashboard/thought" component={Thought} />

      </Switch>
      <div>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
      </div>
    </div>
  );
}

export default DashboardRoutes;
