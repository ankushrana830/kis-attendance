import React from "react";
import { Link } from "react-router-dom";

function AttendenceDetail(props) {
  return (
    <>
      <div className="col-lg-3 mb-4 col-md-3 col-6 order-2 order-lg-3">
        <div className="dashboard_card hovered_box">
          <Link to="#" onClick={props.onLeave}>
            <div className="employee_count">
              <h2 className="text_orange">{props.leaveCount?.onLeave}</h2>
              <p>On-Leave</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default AttendenceDetail;
