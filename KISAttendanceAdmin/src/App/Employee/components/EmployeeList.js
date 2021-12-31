import React, { useEffect, useState } from "react";
import { ToastsStore } from "react-toasts";
import { httpClient } from "../../../constants/Api";
import { USER } from "../../../constants/AppConstants";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import moment from "moment";

function AttendenceDetail() {
  let [attendenceData, setAttendenceData] = useState([]);
  let [updatedList, setAttendenceUpdateData] = useState([]);
  const [searchAlphaTerm, setSearchAlphaTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  let [initialValue, setInitialValue] = useState("");
  let [searchValue, setSearchValue] = useState("");
  const [values, setValues] = useState("");
  let [page, setPage] = useState(0);
  const [showSetEmpId, setEmpId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDelEmp, setshowDelEmp] = useState(false);
  let [total, setDataBind] = useState("");
  const userDetail = useSelector((state) => state.user.user.user);
  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    setShow(true);
    setEmpId(e.target.getAttribute("data-id"));
  };
  const handleCloseDeleteEmployee = () => setshowDelEmp(false);
  const handleShowDeleteEmployee = (e) => {
    setshowDelEmp(true);
    setEmpId(e.target.getAttribute("data-id"));
  };

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

  // const handleChange = (event) => {
  //   setSearchTerm(event.target.value);
  //   const term = event.target.value;
  //   if (searchAlphaTerm) {
  //     let updatedListArray = [];
  //     updatedListArray = handleAlphabet(attendenceData, searchAlphaTerm);
  //     updatedListArray = handleSearchBar(updatedListArray, term);
  //     setAttendenceUpdateData(updatedListArray);
  //   } else {
  //     const updatedListArray = handleSearchBar(attendenceData, term);
  //     setAttendenceUpdateData(updatedListArray);
  //   }
  // };

  // const handleAlphabet = (attendenceData, searchAlphaTerm) => {
  //   return attendenceData.filter((records) => {
  //     return (
  //       records.name
  //         .charAt(0)
  //         .toLowerCase()
  //         .search(searchAlphaTerm.toLowerCase()) !== -1
  //     );
  //   });
  // };

  // const handleSearchBar = (updatedListArray, term) => {
  //   return updatedListArray.filter((records) => {
  //     return (records.name.toLowerCase().search(term.toLowerCase()) !== -1 || records.emp_id.toLowerCase().search(term.toLowerCase()) !== -1)
  //   });
  // };

  // const handleSearch = (event) => {
  //   setSearchAlphaTerm(event.target.text);
  //   const alphabet = event.target.text;
  //   if (searchTerm) {
  //     let updatedListArray = [];
  //     updatedListArray = handleSearchBar(attendenceData, searchTerm);
  //     updatedListArray = handleAlphabet(updatedListArray, alphabet);
  //     setAttendenceUpdateData(updatedListArray);
  //   } else {
  //     const updatedListArray = handleAlphabet(attendenceData, alphabet);
  //     setAttendenceUpdateData(updatedListArray);
  //   }
  // };

  const handleInitialValue = (e) => {
    const initValue = e.target.text;
    setInitialValue(initValue)
    updatedList = "";
    attendenceData = "";
    page = 0;
    setPage(page)
    setAttendenceData(attendenceData)
    setAttendenceUpdateData(updatedList)
    getAllUsers(initValue, searchValue, page)
  }

  const handleSearchValue = (e) => {
    const searchInitValue = e.target.value;
    setSearchValue(searchInitValue)
    updatedList = "";
    attendenceData = "";
    page = 0;
    setPage(page)
    setAttendenceData(attendenceData)
    setAttendenceUpdateData(updatedList)
    getAllUsers(initialValue, searchInitValue, page)
  }

  const resetSearch = () => {
    setInitialValue("")
    setSearchValue("");
    updatedList = ""
    page = 0;
    initialValue = ""
    searchValue = ""
    getAllUsers(initialValue, searchValue, page)
  };

  useEffect(() => {
    getAllUsers(initialValue, searchValue, page);
  }, []);


  const getAllUsers = (initValue, searchInitValue, page) => {
    try {
      setLoading(true);
      setPage(page + 1);
      httpClient
        .get(`${USER.GET_ALL_USER}?page=${page + 1}&alphaTerm=${initValue}&searchText=${searchInitValue}`)
        .then((res) => {
          if (res.status === 200) {
            if (!updatedList) {
              setDataToBind(res.data.user.data);
              setDataBind(res.data.user.total);
              // setDataToBindList(res.data.user.userData);
              setLoading(false);
            } else {
              const updatedData = [...updatedList, ...res.data.user.data];
              setDataToBind(updatedData);
              // setDataToBindList(res.data.user.userData);
              setDataBind(res.data.user.total);
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
        });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMoreData = () => {
    // setPage(page + 1);
    getAllUsers(initialValue, searchValue, page);
  };

  // const setDataToBindList = (response) => {
  //   setAttendenceData(response);
  //   // setLeaveUpdateData(response);
  // };

  const setDataToBind = (response) => {
    setAttendenceData(response);
    setAttendenceUpdateData(response);
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
            getAllUsers(initialValue, searchValue, page);
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

  const exEmployee = async (e) => {
    e.preventDefault();
    const userId = showSetEmpId;
    const data = { userId };
    data.exit_formality = values.exit_formality;
    data.releving_date = moment(values.releving_date);
    try {
      await httpClient
        .post(USER.EX_USER, data)
        .then(async (res) => {
          if (res.status === 200) {
            ToastsStore.success("Employee Deactivated Successfully");
            handleClose();
            getAllUsers(initialValue, searchValue, page);
            values.releving_date = "";
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

  return (
    <div className="col-lg-12">
      <div className="dashboard_card employee_lists">
        <div className="card_title calender_heading">
          <h4>Employee List</h4>
          <div className="d-flex">
            <div className="form-group has-search">
              <span className="fa fa-search form-control-feedback"></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={searchValue}
                onChange={handleSearchValue}
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
              <li className={initialValue === data ? "active" : ""} key={i}>
                <Link to="#" data-target={data} onClick={handleInitialValue}>
                  {data}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="employee_table table-responsive">
          <table className="table table-hover employee-list-table">
            <thead>
              <tr>
                <th scope="col" className="text-nowrap">
                  Employee Name
                </th>
                <th scope="col" className="textCenter text-nowrap">
                  Employee ID
                </th>
                <th scope="col" className="textCenter">
                  Email
                </th>
                <th scope="col" className="textCenter text-nowrap">
                  Phone Number{" "}
                </th>
                <th scope="col" className="textCenter">
                  Designation
                </th>
                <th scope="col" className="textCenter">
                  Role
                </th>
                <th scope="col" className="textCenter">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {updatedList && updatedList.map((data, i) => (
                <tr key={i}>
                  <td className="textCenter text-nowrap">{data.name}</td>
                  <td className="textCenter text-nowrap">{data.emp_id}</td>
                  <td className="textCenter text-nowrap">{data.email}</td>
                  <td className="textCenter text-nowrap">{data.phone}</td>
                  <td className="textCenter text-nowrap">{data.designation}</td>
                  <td className="textCenter text-nowrap">
                    {data.role ? (data.role.role ? data.role.role : "-") : "-"}
                  </td>
                  <td className="textCenter">
                    <div className="d-flex">
                      <Link to={`/employee/attendence-detail/${data.id}`}>
                        <button
                          title="Attendence Detail"
                          className="view_emp_detail table_btn mx-1"
                        >
                          <i className="fa fa-hand-paper-o" aria-hidden="true"></i>
                        </button>
                      </Link>
                      <Link to={`/employee/detail/${data.id}`}>
                        <button
                          title="Employee Detail"
                          className="view_emp_detail table_btn mx-1"
                        >
                          <i className="fa fa-user-o" aria-hidden="true"></i>
                        </button>
                      </Link>
                      {(userDetail.role.role == "Super Admin" ||
                        userDetail.role.role == "HR") && (
                          <>
                            <Link to={{ pathname: `/employee/edit/${data.id}` }}>
                              <button
                                title="Edit Employee"
                                className="edit_emp_detail table_btn mx-1"
                                disabled
                                style={{ cursor: "pointer" }}
                              >
                                <i
                                  className="fa fa-pencil-square-o"
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </Link>
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

                            <button
                              onClick={handleShow}
                              data-target={data.id}
                              title="Remove Employee"
                              className="edit_emp_detail table_btn mx-1"
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className="fa fa-ban"
                                data-id={data.id}
                                aria-hidden="true"
                              ></i>
                            </button>
                          </>
                        )}
                    </div>
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
          {updatedList.length <= 0 || updatedList?.length < total && (
            <div className="text-center">
              {/* <button
                      onClick={() => fetchMoreData()}
                      type="button"
                      className="btn btn-primary"
                    > 
                      Load more
                    </button> */}
              <InfiniteScroll
                dataLength={updatedList?.length}
                next={fetchMoreData}
                hasMore={true}
                loader={initialValue || searchValue ? "" : <h4>Loadings...</h4>}
              >
                {updatedList?.map((i, index) => (
                  <div key={index}></div>
                ))}
              </InfiniteScroll>
            </div>
          )}
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <form onSubmit={exEmployee}>
          <Modal.Header>
            <Modal.Title>Confirm Remove</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-4 col-lg-6">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Relieving Date
              </label>
              <input
                type="date"
                value={values.releving_date}
                onChange={(e) =>
                  setValues({
                    ...values,
                    releving_date: e.target.value,
                  })
                }
                required
                className="form-control"
                placeholder="Enter Designation"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-4 col-lg-8">
              <input
                type="checkbox"
                value="true"
                onChange={(e) =>
                  setValues({
                    ...values,
                    exit_formality: e.target.value,
                  })
                }
                style={{ marginRight: "10px" }}
                name="exit_formality"
              />
              <label htmlFor="exampleInputEmail1" className="form-label">
                Is Relieving Formalities are done?
              </label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </Modal.Footer>
        </form>
      </Modal>
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

export default AttendenceDetail;
