import React from "react";
import { Link } from "react-router-dom";

function UnCheckedEmployees(props ) {
  return (
    <div className="col-lg-3 mb-4 col-6 col-md-3 order-4 order-lg-4">
      <div className="dashboard_card hovered_box">
        <Link to="#" onClick={props.unChecked}>
          <div className="employee_count">
            <h2 className="text_blue">{props.unCheckedCount?.unChecked}</h2>
            <p>Un-Checked Employee</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default UnCheckedEmployees;
