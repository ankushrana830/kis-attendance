import React from "react";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";
import EmployeeList from "./routes/Employee";
import AddEmployee from "./routes/AddEmployee";
import EmployeeAttendenceDetail from "./routes/EmployeeAttendenceDetail";
// import Sidebar from "../Layouts/Sidebar";
import Header from "../Layouts/Header";
import EditEmployee from "./components/EditEmployee";
import ExEmployees from "./components/ExEmployees";
import EmployeesLeaveHistory from "./components/EmployeesLeaveHistory";
import LeaveHistory from "./components/LeaveHistory";
import EmployeeDetail from "./routes/EmployeeDetail";

function EmployeeRoutes(props) {
  const { path } = useRouteMatch();
  return (
    <div className="main_wrapper">
      {/* <Sidebar /> */}
      <Header />
      <Switch>
        <Redirect exact from={`${path}`} to={`${path}`} />
        <Route path="/employee/list" component={EmployeeList} />
        <Route path="/employee/add" component={AddEmployee} />
        <Route path="/employee/detail/:userId" component={EmployeeDetail} />
        <Route
          path="/employee/attendence-detail/:userId"
          component={EmployeeAttendenceDetail}
        />
        <Route path="/employee/ex-employees" component={ExEmployees} />
        <Route
          exact
          path="/employee/leave-history"
          component={EmployeesLeaveHistory}
        />
        <Route path="/employee/edit/:userId" component={EditEmployee} />
        <Route
          exact
          path="/employee/leave-history/:userId"
          component={LeaveHistory}
        />
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

export default EmployeeRoutes;
