import React from "react";
import "./App.css";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { createBrowserHistory } from "history";
import Login from "./components/Login";
import DashboardRoutes from "./App/Dashboard";
import EmployeeRoutes from "./App/Employee/index";
// import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const history = createBrowserHistory();
  return (
    <div>
      <Router history={history}>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/login" />} />
          <Route path="/login" component={Login} />
          <Route path="/employee" component={EmployeeRoutes} />
          <Route path="/dashboard" component={DashboardRoutes} />
          <Route path="*" component={() => "404 NOT FOUND"} />
        </Switch>
      </Router>
      <div>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
      </div>
    </div>
  );
}

export default App;
