import React, { useEffect, useState } from "react";
import moment from "moment";
import { ToastsStore } from "react-toasts";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { httpClient } from "../../../constants/Api";
import { LEAVES, USER } from "../../../constants/AppConstants";

function LeaveHistory() {
  const { userId } = useParams();
  const [userLeaves, setUserLeaves] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [page, setPage] = useState(0);
  useEffect(() => {
    const getUserDetail = async () => {
      try {
        await httpClient
          .get(USER.GET_BY_ID.replace("{id}", userId))
          .then((res) => {
            if (res.status === 200) {
              setUser(res.data.user);
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
    getUserLeaves();
    getUserDetail();
  }, [userId]);

  const getUserLeaves = async () => {
    setPage(page + 1);
    try {
      setLoading(true);
      await httpClient
        .get(`${LEAVES.GET_USER_LEAVES}?page=${page + 1}`.replace("{id}", userId))
        .then((res) => {
        
          if (res.status === 200) {
            if(!userLeaves){
              setUserLeaves(res.data.leaves);
              setLoading(false);
            }else{
              const updatedData = [...userLeaves.data, ...res.data.leaves.data];
              setUserLeaves({ ...userLeaves.data, data: updatedData });
              setLoading(false);
            }
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

  const formatTime = (time) => {
    return moment(time, "h:m").format("hh:mm A");
  };
  const fetchMoreData = () => {
    // setPage(page + 1);
    getUserLeaves();
  };

  return (
    <>
      <div className="main_content_panel container">
        <div className="header_title">
          <h1>
            <span>Leaves Request of </span> {user.name}
          </h1>
          <div className="d-flex">
            {user.allotted_leaves && (
              <>
                {user.allotted_leaves >= 12 ? (
                  <div className=" mx-2 text-center">
                    <span className="allotted_leaves">Leaves Allotted </span>
                    <br />
                    <span className="display-6">{user?.allotted_leaves}</span>
                    <br />
                    <span className="allotted_leaves">
                      Since {`(${moment().startOf("year").format("L")})`}
                    </span>
                  </div>
                ) : (
                  <div className=" mx-2 text-center">
                    <span className="allotted_leaves">Leaves Allotted</span>
                    <br />
                    <span className="display-6">{user?.allotted_leaves}</span>
                    <br />
                    <span className="allotted_leaves">
                      Since {`(${moment(user?.doj).format("L")})`}
                    </span>
                  </div>
                )}
              </>
            )}
            {(user.pending_leaves || user.pending_leaves === 0) && (
              <div className="history_leaves_pending text-center">
                <span className="history_allotted_leaves">Leaves Pending</span>
                <br />
                <span className="display-6 ">
                  {user?.pending_leaves >= 0 ? user?.pending_leaves : 0}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="dashboard_card employee_lists">
              {/* <div className="card_title calender_heading">
                <div className="filter_history w-100">
                  <form>
                    <div className="row align-items-end">
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>
                            <b>Status:</b>
                          </label>
                          <select className="form-control">
                            <option>Pending</option>
                            <option>Approved</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <label>
                          <b>From Date:</b>
                        </label>
                        <input type="date" className="form-control" />
                      </div>
                      <div className="col-md-2">
                        <label>
                          <b>To Date:</b>
                        </label>
                        <input type="date" className="form-control" />
                      </div>
                      <div className="col-md-4">
                        <label>
                          <b>Leave Type:</b>
                        </label>
                        <select className="form-control">
                          <option>All</option>
                          <option>Sick</option>
                        </select>
                      </div>
                      <div className="col-md-2 text-end">
                        <button type="button" className="btn btn-success">
                          Search
                        </button>
                        <button type="button" className="btn btn-danger ms-1">
                          Clear
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div> */}
              <div className="employee_table">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Status</th>
                      <th scope="col">Start Date</th>
                      <th scope="col">End Date</th>
                      <th scope="col">Time</th>
                      <th scope="col">Type</th>
                      <th scope="col" className="text-nowrap">
                        Submission Date
                      </th>
                      <th scope="col">Reason of Leave</th>
                      <th scope="col">Reason of Rejection</th>
                      {/* <th scope="col">Team Lead</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {userLeaves.data?.length > 0 &&
                      userLeaves.data.map((leave, i) => (
                        <tr key={i}>
                          <td className="text-nowrap">
                            {leave.status === "pending" && (
                              <span className="text-warning text-capitalize">
                                {leave.status}
                              </span>
                            )}
                            {leave.status === "approved" && (
                              <span className="text-success text-capitalize">
                                {leave.status}
                              </span>
                            )}
                            {leave.status === "rejected" && (
                              <span className="text-danger text-capitalize">
                                {leave.status}
                              </span>
                            )}
                            {leave.status === "cancelled" && (
                              <span className="text-decoration-line-through text-capitalize">
                                {leave.status}
                              </span>
                            )}
                          </td>
                          <td className="text-nowrap">
                            {moment(leave.from).format("L")}
                          </td>
                          <td className="text-nowrap">
                            {leave.type === "Half Day" ||
                            leave.type === "Short Leave" ||
                            moment(
                              moment(leave.from).format("YYYY/MM/DD")
                            ).isSame(
                              moment(moment(leave.to).format("YYYY/MM/DD"))
                            )
                              ? "-"
                              : moment(leave.to).format("L")}
                          </td>

                          <td className="text-nowrap">
                            {" "}
                            {leave.start_time
                              ? formatTime(leave.start_time)
                              : "-- : --"}{" "}
                            -{" "}
                            {leave.end_time
                              ? formatTime(leave.end_time)
                              : "-- : --"}
                          </td>
                          <td className="text-nowrap">{leave.type}</td>
                          <td className="text-nowrap">
                            {moment(leave.createdAt).format("L")}
                          </td>
                          <td>{leave.leave_reason}</td>
                          <td>{leave.reject_reason}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {!loading && userLeaves.data?.length <= 0 && (
                  <div className="d-flex justify-content-center">
                    <h5>No Records to Display.</h5>
                  </div>
                )}
                
                {userLeaves.length <= 0 || userLeaves.data?.length < userLeaves.total && (
                  <div className="text-center">
                    {/* <button
                      onClick={() => fetchMoreData()}
                      type="button"
                      className="btn btn-primary"
                    > 
                      Load more
                    </button> */}
                    <InfiniteScroll
                      dataLength={userLeaves.data?.length}
                      next={fetchMoreData}
                      hasMore={true}
                      loader={<h4>Loading...</h4>}
                    >
                      {userLeaves.data?.map((i, index) => (
                        <div key={index}></div>
                      ))}
                    </InfiniteScroll>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* {loading && (
          <div className="d-flex justify-content-center">
            <h5>please wait....</h5>
          </div>
        )} */}
      </div>
    </>
  );
}

export default LeaveHistory;
