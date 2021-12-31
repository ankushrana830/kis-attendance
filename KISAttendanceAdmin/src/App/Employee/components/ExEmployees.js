import React, { useEffect, useState } from "react";
import { ToastsStore } from "react-toasts";
import { httpClient } from "../../../constants/Api";
import { USER } from "../../../constants/AppConstants";
import { Link } from "react-router-dom";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";

function ExEmployees() {
  const [attendenceData, setAttendenceData] = useState([]);
  let [updatedList, setAttendenceUpdateData] = useState([]);
  const [searchAlphaTerm, setSearchAlphaTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSetEmpId, setEmpId] = useState("");
  const [showDelEmp, setshowDelEmp] = useState(false);
  const [loading, setLoading] = useState(true);
  const alpha = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const handleCloseDeleteEmployee = () => setshowDelEmp(false);
  const handleShowDeleteEmployee = (e) => {
    setshowDelEmp(true);
    setEmpId(e.target.getAttribute("data-id"));
  };

  const deleteEmployee = async (e) => {
    e.preventDefault();
    const userId = showSetEmpId;
    const data = { userId };
    try {
      await httpClient
        .delete(USER.DELETE_USER, { data })
        .then(async (res) => {
          if (res.status === 200) {
            ToastsStore.success("Employee Deleted Successfully");
            handleCloseDeleteEmployee();
            getAllUsers();
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            ToastsStore.error(err.response.data.message);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    const term = event.target.value;
    if (searchAlphaTerm) {
      let updatedListArray = [];
      updatedListArray = handleAlphabet(attendenceData, searchAlphaTerm);
      updatedListArray = handleSearchBar(updatedListArray, term);
      setAttendenceUpdateData(updatedListArray);
    } else {
      const updatedListArray = handleSearchBar(attendenceData, term);
      setAttendenceUpdateData(updatedListArray);
    }
  };

  const handleAlphabet = (attendenceData, searchAlphaTerm) => {
    return attendenceData.filter((records) => {
      return (
        records.name
          .charAt(0)
          .toLowerCase()
          .search(searchAlphaTerm.toLowerCase()) !== -1
      );
    });
  };

  const handleSearchBar = (updatedListArray, term) => {
    return updatedListArray.filter((records) => {
      return (records.name.toLowerCase().search(term.toLowerCase()) !== -1 || records.emp_id.toLowerCase().search(term.toLowerCase()) !== -1);
    });
  };

  const handleSearch = (event) => {
    setSearchAlphaTerm(event.target.text);
    const alphabet = event.target.text;
    if (searchTerm) {
      let updatedListArray = [];
      updatedListArray = handleSearchBar(attendenceData, searchTerm);
      updatedListArray = handleAlphabet(updatedListArray, alphabet);
      setAttendenceUpdateData(updatedListArray);
    } else {
      const updatedListArray = handleAlphabet(attendenceData, alphabet);
      setAttendenceUpdateData(updatedListArray);
    }
  };

  const resetSearch = () => {
    setAttendenceUpdateData(attendenceData);
    setSearchAlphaTerm("");
    setSearchTerm("");
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    try {
      setLoading(true)
      httpClient
        .get(`${USER.GET_EX_EMPLOYEES}`)
        .then((res) => {
          if (res.status === 200) {
            setDataToBind(res.data.user);
            setLoading(false)
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

  const setDataToBind = (response) => {
    setAttendenceData(response);
    setAttendenceUpdateData(response);
  };

  return (
    <div className="main_content_panel vh-100">
      <div className="row">
        <div className="col-lg-12">
          <div className="dashboard_card employee_lists">
            <div className="card_title calender_heading">
              <h4>Ex-Employee List</h4>
              <div className="d-flex">
                <div className="form-group has-search">
                  <span className="fa fa-search form-control-feedback"></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={handleChange}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  style={{ marginLeft: "1rem", borderRadius: "50px" }}
                  onClick={resetSearch}
                >
                  Reset Filter
                </button>
              </div>
            </div>
            <div className="filter_letters">
              <ul>
                <li className=""></li>
              </ul>
            </div>
            <div className="filter_letters">
              <ul>
                {alpha.map((data, i) => (
                  <li
                    className={searchAlphaTerm === data ? "active" : ""}
                    key={i}
                  >
                    <Link to="#" data-target={data} onClick={handleSearch}>
                      {data}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="employee_table">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Employee Name</th>
                    <th scope="col" className="textCenter">
                      Employee ID
                    </th>
                    <th scope="col" className="textCenter">
                      Email
                    </th>
                    <th scope="col" className="textCenter">
                      Phone Number{" "}
                    </th>
                    <th scope="col" className="textCenter">
                      Designation
                    </th>
                    <th scope="col" className="textCenter">
                      Relieving Date
                    </th>
                    <th scope="col" className="textCenter">
                      Exit Formalities
                    </th>
                    <th scope="col" className="textCenter">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {updatedList.map((data, i) => (
                    <tr key={i}>
                      <td>{data.name}</td>
                      <td className="textCenter">{data.emp_id}</td>
                      <td className="textCenter">{data.email}</td>
                      <td className="textCenter">{data.phone}</td>
                      <td className="textCenter">{data.designation}</td>
                      <td className="textCenter">
                        {moment(data.releving_date).format("DD-MM-YYYY")}
                      </td>
                      <td className="textCenter">
                        {data.exit_formality ? (
                          <i className="fa fa-check" style={{ color: "green" }}></i>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="textCenter">
                        {" "}
                        <button
                          onClick={handleShowDeleteEmployee}
                          title="Delete Employee"
                          className="edit_emp_detail table_btn mx-1"
                          style={{ cursor: "pointer" }}
                        >
                          <i
                            className="fa fa-trash"
                            data-id={data.id}
                            aria-hidden="true"
                          ></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && updatedList.length <= 0 && (
                <div className="d-flex justify-content-center">
                  <h5>No Records to Display.</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal show={showDelEmp} onHide={handleCloseDeleteEmployee}>
        <Modal.Body>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ paddingBottom: "10px" }}>
            Are you sure you want to delete this employee?
          </div>
          <Button variant="secondary" onClick={handleCloseDeleteEmployee}>
            No
          </Button>
          <Button variant="primary" onClick={deleteEmployee}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ExEmployees;
