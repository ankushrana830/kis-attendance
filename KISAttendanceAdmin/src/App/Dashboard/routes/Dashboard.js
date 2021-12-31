import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastsStore } from "react-toasts";
import TotalEmployee from "../components/TotalEmployee";
import PresentEmployee from "../components/PresentEmployee";
import AbsentEmployee from "../components/AbsentEmployee";
// import AddEmployee from "../components/AddEmployee";
import ListEmployee from "../components/ListEmployee";
import OnLeaveEmployee from "../components/OnLeaveEmployee";
import UnCheckedEmployees from "../components/UnCheckedEmployees";
import UnCheckedEmployeeList from "../components/UnCheckedEmployeeList";
import { httpClient } from "../../../constants/Api";
import { COUNT } from "../../../constants/AppConstants";

function Dashboard() {
  const userDetail = useSelector((state) => state.user.user.user);
  const [showList, setShowList] = useState({
    presentEmployees: true,
    absentEmployees: false,
    uncheckedEmployees: false,
  });
  const [renderList, setRenderList] = useState(true);

  const [count, setCount] = useState("");

  useEffect(() => {
    const getCount = async () => {
      await httpClient
        .get(COUNT.GET_COUNT)
        .then((res) => {
          if (res.status === 200) {
            setCount(res.data.result);
          }
        })
        .catch((err) => {
          if (err.response) {
            ToastsStore.error(err.response.data.message);
          } else {
            ToastsStore.error("Something went wrong");
          }
        });
    };
    getCount();
  }, [showList]);

  const handlePresentEmployeeList = () => {
    setShowList({
      presentEmployees: true,
      absentEmployees: false,
      uncheckedEmployees: false,
    });
    setRenderList(!renderList);
  };
  const handleAbsentEmployeeList = () => {
    setShowList({
      presentEmployees: false,
      absentEmployees: true,
      uncheckedEmployees: false,
    });
    setRenderList(!renderList);
  };
  const handleUnCheckedEmployeeList = () => {
    setShowList({
      presentEmployees: false,
      absentEmployees: false,
      uncheckedEmployees: true,
    });
    setRenderList(!renderList);
  };

  return (
    <>
      <div className="main_content_panel">
        <div className="header_title">
          <h1>
            <span>Welcome</span> {userDetail.name}
          </h1>
        </div>
        <div className="row">
          <TotalEmployee totalCount={count} />
          <PresentEmployee
            presentEmployees={handlePresentEmployeeList}
            presentCount={count}
          />
          <AbsentEmployee
            onLeave={handleAbsentEmployeeList}
            leaveCount={count}
          />
          <UnCheckedEmployees
            unChecked={handleUnCheckedEmployeeList}
            unCheckedCount={count}
          />
          {showList.presentEmployees && (
            <ListEmployee  renderList={renderList} />
          )}
          {showList.absentEmployees && <OnLeaveEmployee renderList={renderList} />}
          {showList.uncheckedEmployees && (
            <UnCheckedEmployeeList renderList={renderList} />
          )}

         
        </div>
      </div>
    </>
  );
}

export default Dashboard;
