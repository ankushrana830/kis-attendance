import React from "react";
import { Link } from "react-router-dom";

function AttendenceDetail(props ) {

  return (
    <div className="col-lg-3 mb-4 col-md-3 col-6 order-1 order-lg-2">
      <div className="dashboard_card hovered_box">
        <Link to="#" onClick={props.presentEmployees} >
          <div className="employee_count">
            <h2 className="text_green">{props.presentCount?.present}</h2>
            <p>Present</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AttendenceDetail;
