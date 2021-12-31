import React, { useState, useEffect } from "react";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { ToastsStore } from "react-toasts";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getRequests } from "../../../redux/actions/ChangeRequestActions";
import { httpClient } from "../../../constants/Api";
import { REQUEST } from "../../../constants/AppConstants";

function Dashboard() {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState("");
  const [show, setShow] = useState(false);
  const [empId, setEmpId] = useState("");
  const [page, setPage] = useState(0);

  const handleClose = () => setShow(false);

  const handleShow = (data) => {
    setShow(true);
    setEmpId(data);
  };
  useEffect(() => {
    const updateSeenNotifications = async () => {
      await httpClient
        .put(REQUEST.UPDATE_SEEN_NOTIFICATIONS)
        .then((res) => {
          if (res.status === 200) {
            dispatch(getRequests());
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

    updateSeenNotifications();
    getChangeRequests();
  }, []);

  const getChangeRequests = async () => {
    setPage(page + 1);
    await httpClient
      .get(`${REQUEST.GET_REQUEST}?page=${page + 1}`)
      .then((res) => {
        if (res.status === 200) {
          if (!requests) {
            setRequests(res.data.result);
          } else {
            const updatedData = [...requests.data, ...res.data.result.data];
            setRequests({ ...requests.data, data: updatedData });
          }
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

  const fetchMoreData = () => {
    // setPage(page + 1);
    getChangeRequests();
  };

  const removeRequest = async (e) => {
    e.preventDefault();
    await httpClient
      .post(REQUEST.REMOVE_REQUEST, { id: empId._id })
      .then((res) => {
        debugger;
        if (res.status === 200) {
          const index = requests.data.indexOf(empId);
          if (index > -1) {
            requests.data.splice(index, 1);
          }
          ToastsStore.success("Removed Successfully");
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
  };

  return (
    <>
      <div className="main_content_panel">
        <div className="row">
          <div className="main_content_panel container ">
            <div className="row ">
              <div className="offset-lg-2 col-lg-8 ">
                <div className="header_title">
                  <h1>
                    {" "}
                    <span>All</span> Notifications
                  </h1>
                </div>
              </div>
              <div className="offset-lg-2 col-lg-8 mb-4">
                <div className="dashboard_card ">
                  {requests.data?.length > 0 ? (
                    requests.data.map((data, i) => (
                      <div
                        className="notification notification-closable list-group-item p-3"
                        role="alert"
                        key={i}
                      >
                        <div className="d-flex justify-content-between mb-3">
                          <div className="noti_sender_time">
                            <strong>{data.user_id.name} </strong>{" "}
                            <span>

                              {moment(data.createdAt).format("D MMMM YYYY")}
                            </span>
                          </div>
                          <div>
                            {data.type === "Change Request" && (
                              <Link to={`/employee/attendence-detail/${data.user_id.id}`}>
                                <button
                                  type="button"
                                  className="border-0  close btn-success mx-1"
                                  style={{ borderRadius: "5px" }}
                                >
                                  <i
                                    className="fa fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              </Link>
                            )}
                            {data.type === "Leave Request" && (
                              <Link
                                to={`/employee/leave-history/${data.user_id.id}`}
                              >
                                <button
                                  title="View Request"
                                  type="button"
                                  className="border-0  close btn-success mx-1"
                                  style={{ borderRadius: "5px" }}
                                >
                                  <i
                                    className="fa fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              </Link>
                            )}
                            <button
                              title="Remove Request"
                              type="button"
                              className="border-0 btn-danger close"
                              data-close="notification"
                              onClick={(e) => handleShow(data)}
                              style={{ borderRadius: "5px" }}
                            >
                              <i
                                className="fa fa-trash-o"
                                data-id={data.id}
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                        </div>
                        <p> {data.request_message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="d-flex justify-content-center">
                      <h5>No Records to Display.</h5>
                    </div>
                  )}
                </div>
                {requests.data?.length < requests.total && (
                  <div className="text-center">
                    {/* <button
                      onClick={() => fetchMoreData()}
                      type="button"
                      className="btn btn-primary"
                    >
                      Load more
                    </button> */}
                    <InfiniteScroll
                      dataLength={requests.data?.length}
                      next={fetchMoreData}
                      hasMore={true}
                      loader={<h4>Loading...</h4>}
                    >
                      {requests.data?.map((i, index) => (
                        <div key={index}></div>
                      ))}
                    </InfiniteScroll>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Confirm Remove Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ paddingBottom: "10px" }}>
            Are you sure you want to remove this request?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={removeRequest}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Dashboard;
