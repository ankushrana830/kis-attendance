import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { httpClient } from "../../../../constants/Api";
import { LEAVES } from "../../../../constants/AppConstants";
import { ToastsStore } from "react-toasts";
import moment from "moment";

function UrgentLeave(props) {
  const [values, setValues] = useState([]);
  const [error, setError] = useState({
    typeError: "",
    textError: "",
    dateError: "",
    endTimeError: "",
  });

  const handleEndTime = (e) => {
    const timeDiff = moment(e.target.value, "hh:mm").diff(
      moment(values.start_time, "hh:mm"),
      "m"
    );
    if (values.type === "Half Day" && (timeDiff > 240 || timeDiff < 0)) {
      setError({ ...error, endTimeError: "You can't apply more than 4 hours" });
    } else if (
      values.type === "Short Leave" &&
      (timeDiff > 120 || timeDiff < 0)
    ) {
      setError({ ...error, endTimeError: "You can't apply more than 2 hours" });
    } else {
      setValues({ ...values, end_time: e.target.value });
      setError({ ...error, endTimeError: "" });
    }
  };
  const valid = () => {
    let check = true;
    const checkValues = values;
    const timeDiff = moment(values.end_time, "hh:mm").diff(
      moment(values.start_time, "hh:mm"),
      "m"
    );
    if (!checkValues.type) {
      setError({ ...error, typeError: "Please select leave type" });
      check = false;
    } else if (checkValues.leave_reason.trim() === "") {
      setError({ ...error, textError: "Please enter reason" });
      check = false;
    } else if (error.dateError) {
      check = false;
    } else if (
      values.type === "Half Day" &&
      (timeDiff > 240 || timeDiff < 0 || Number.isNaN(timeDiff))
    ) {
      setError({ ...error, endTimeError: "you can't apply more than 4 hours" });
      check = false;
    } else if (
      values.type === "Short Leave" &&
      (timeDiff > 120 || timeDiff < 0 || Number.isNaN(timeDiff))
    ) {
      setError({ ...error, endTimeError: "you can't apply more than 2 hours" });
      check = false;
    } else {
      setError("");
      check = true;
    }
    return check;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = valid();
    values.from = moment().format();
    values.to = moment().format();
    values.status = "approved";
    if (isValid) {
      try {
        await httpClient
          .post(LEAVES.URGENT_LEAVE.replace("{id}", props.userId), values)
          .then((res) => {
            if (res.status === 200) {
              ToastsStore.success(res.data.message);
              props.close();
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
    }
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.close}
        keyboard={false}
        size="md"
        centered
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header className="border-0">
            <h5 className="modal-title" id="exampleModalLabel">
              Grant Urgent Leave
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={props.close}
            ></button>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="mb-4 col-md-12">
                <label>Leave Type</label>
                <select
                  className="form-control"
                  aria-label="Default select example"
                  value={values.type}
                  onChange={(e) =>
                    setValues({ ...values, type: e.target.value })
                  }
                  required
                >
                  <option value="">Select...</option>
                  <option value="Short Leave">Short Leave</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Full Day">Full Day</option>
                </select>
              </div>
              {values.type !== "Full Day" && (
                <div className="mb-4 col-lg-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Leave Start TIme
                  </label>
                  <input
                    required
                    type="time"
                    className="form-control"
                    placeholder="Time From"
                    value={values.start_time}
                    onChange={(e) =>
                      setValues({ ...values, start_time: e.target.value })
                    }
                  />
                </div>
              )}
              {values.type !== "Full Day" && (
                <div className="mb-4 col-lg-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Leave End TIme
                  </label>
                  <input
                    required
                    type="time"
                    className="form-control"
                    placeholder="Time To"
                    value={values.end_time}
                    onChange={handleEndTime}
                    // onChange={(e) =>
                    //   setValues({ ...values, end_time: e.target.value })
                    // }
                  />
                  <small className="text-danger">{error.endTimeError}</small>
                </div>
              )}
              <div className="col-md-12">
                <label>Leave Reason</label>
                <textarea
                  required
                  rows="4"
                  className="form-control"
                  value={values.leave_reason}
                  onChange={(e) =>
                    setValues({ ...values, leave_reason: e.target.value })
                  }
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={props.close}
            >
              Close
            </button>
            <button type="submit" className="btn btn-submit ">
              Submit
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default UrgentLeave;
