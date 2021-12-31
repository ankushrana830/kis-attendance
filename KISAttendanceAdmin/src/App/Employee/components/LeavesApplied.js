import React, { useState, useEffect } from "react";
import { ToastsStore } from "react-toasts";
import { Link } from "react-router-dom";
import moment from "moment";
import RejectLeave from "./Modals/RejectLeave";
import { httpClient } from "../../../constants/Api";
import { LEAVES } from "../../../constants/AppConstants";

function LeavesApplied({ userId, getUserDetail }) {
  const [leaves, setLeaves] = useState("");
  const [show, setShow] = useState({ open: false, leaveId: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserLeaves();
  }, []);

  const getUserLeaves = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(LEAVES.GET_USER_PENDING_LEAVES.replace("{id}", userId))
        .then((res) => {
          if (res.status === 200) {
            setLeaves(res.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (err.response) {
            ToastsStore.error(err.response.data.message);
          } else {
            ToastsStore.error("Something went wrong");
          }
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const approveLeave = async (leaveId) => {
    try {
      await httpClient
        .put(LEAVES.APPROVE_LEAVE.replace("{id}", leaveId), {
          // userId: userId,
          status: "approved",
        })
        .then((res) => {
          if (res.status === 200) {
            setShow({ open: false });
            getUserLeaves();
            getUserDetail();
            ToastsStore.success(res.data.message);
          }
        })
        .catch((err) => {
          if (err.response) {
            ToastsStore.error(err.response.data.message);
          } else {
            ToastsStore.error("Something went wrong");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };
  const rejectLeave = async (reason) => {
    try {
      const formModal = {
        reject_reason: reason,
        // userId: userId,
        status: "rejected",
      };
      await httpClient
        .put(LEAVES.REJECT_LEAVE.replace("{id}", show.leaveId), formModal)
        .then((res) => {
          if (res.status === 200) {
            getUserLeaves();
            ToastsStore.success(res.data.message);
            handleClose();
          }
        })
        .catch((err) => {
          if (err.response) {
            ToastsStore.error(err.response.data.message);
          } else {
            ToastsStore.error("Something went wrong");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setShow({ open: false });
  };

  return (
    <>
      <div className="dashboard_card">
        <div className="employee_profile ">
          <div className="card_title admin_heading pe-0">
            <h4>Leave Request</h4>
            <Link to={`/employee/leave-history/${userId}`}>
              <button type="button" className="btn btn-secondary calender_view">
                View All
              </button>
            </Link>
          </div>
        </div>
        {leaves.length > 0 &&
          leaves.map((leave, i) => (
            <div className="leave_status mb-3" key={i}>
              <h5 className="mb-0 me-3 w-50">
                {moment(leave.from).format("D MMMM YYYY")}
                {moment(leave.from).isSame(leave.to, "day")
                  ? ""
                  : `  ${
                      leave.type === "Half Day" ||
                      leave.type === "Short Leave" ||
                      moment(leave.from).isSame(
                        moment(leave.to).format("YYYY-MM-DD")
                      )
                        ? ""
                        : " to " + moment(leave.to).format("D MMMM YYYY")
                    }`}
                <span className="m-2"> - {leave.type}</span>
              </h5>
              <div className="leave_btns">
                <button
                  className="btn btn-leave_status"
                  onClick={(e) => approveLeave(leave._id)}
                >
                  {" "}
                  Approve Leave
                </button>
                <button
                  className="btn btn-leave_status ms-2 bg-danger"
                  onClick={(e) => setShow({ open: true, leaveId: leave._id })}
                >
                  Reject Leave
                </button>
              </div>
            </div>
          ))}

        {!loading && leaves.length <= 0 && (
          <div className="d-flex justify-content-center">
            <h5>No Records to Display.</h5>
          </div>
        )}
      </div>
      <RejectLeave
        open={show.open}
        close={handleClose}
        rejectLeave={rejectLeave}
      />
    </>
  );
}

export default LeavesApplied;
