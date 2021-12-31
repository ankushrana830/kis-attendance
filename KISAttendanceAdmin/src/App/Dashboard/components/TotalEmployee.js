import React from "react";
import { Link } from "react-router-dom";

function AttendenceDetail({ totalCount }) {

  return (
    <div className="col-lg-3 mb-4 col-md-3 col-6 order-3 order-lg-1">
      <div className="dashboard_card hovered_box">
        <Link to="/employee/list">
          <div className="employee_count">
            <h2 className="text_blue">{totalCount?.total}</h2>
            <p>Total Employee</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AttendenceDetail;
