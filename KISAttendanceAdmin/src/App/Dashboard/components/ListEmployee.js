import React, { useEffect, useState } from "react";
import { ToastsStore } from "react-toasts";
import moment from "moment";
import { Link } from "react-router-dom";
import { httpClient } from "../../../constants/Api";
import { ATTENDENCE } from "../../../constants/AppConstants";
import InfiniteScroll from "react-infinite-scroll-component";

function AttendenceDetail({ renderList }) {
  let [attendenceData, setAttendenceData] = useState([]);
  let [updatedList, setAttendenceUpdateData] = useState([]);
  const [searchAlphaTerm, setSearchAlphaTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  let [page, setPage] = useState(0);
  let [total, setDataBind] = useState("");
  const [loading, setLoading] = useState(true);
  let [initialValue, setInitialValue] = useState("");
  let [searchValue, setSearchValue] = useState("");
  let [optionValue, setOptionValue] = useState("");
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

  const handleInitialValue = (e) => {
    const initValue = e.target.text;
    setInitialValue(initValue);
    updatedList = [];
    attendenceData = "";

    page = 0;

    setPage(page);
    setAttendenceData(attendenceData);
    setAttendenceUpdateData(updatedList);
    getTodayReport(initValue, searchValue, optionValue, page);
  };

  const handleSearchValue = (e) => {
    e.preventDefault();
    // const searchInitValue = e.target.value;
    // setSearchValue(searchInitValue);
    updatedList = "";
    attendenceData = "";

    page = 0;

    setPage(page);
    setAttendenceData(attendenceData);
    setAttendenceUpdateData(updatedList);
    getTodayReport(initialValue, searchValue, optionValue, page);
  };

  const handleOptionValue = (e) => {
    const optionInitValue = e.target.value;
    setOptionValue(optionInitValue);
    updatedList = "";
    attendenceData = "";

    page = 0;

    setPage(page);
    setAttendenceData(attendenceData);
    setAttendenceUpdateData(updatedList);
    getTodayReport(initialValue, searchValue, optionInitValue, page);
  };

  // const handleChange = (event) => {
  //   setSearchTerm(event.target.value);
  //   const term = event.target.value;
  //   if (searchAlphaTerm || optionValue) {
  //     let updatedListArray = [];
  //     updatedListArray = handleAlphabet(attendenceData, searchAlphaTerm);
  //     updatedListArray = handleSearchBar(updatedListArray, term);
  //     updatedListArray = filterLeaveStatus(updatedListArray, optionValue);
  //     setAttendenceUpdateData(updatedListArray);
  //   } else {
  //     const updatedListArray = handleSearchBar(attendenceData, term);
  //     setAttendenceUpdateData(updatedListArray);
  //   }
  // };

  const fetchMoreData = () => {
    getTodayReport(initialValue, searchValue, optionValue, page);
  };
  // const handleChangeOption = (event) => {
  //   const term = event.target.value;
  //   setOptionValue(event.target.value)
  //   let updatedListArray = [];
  //   updatedListArray = filterLeaveStatus(attendenceData, term);
  //   updatedListArray = handleSearchBar(updatedListArray, searchTerm);
  //   updatedListArray = handleAlphabet(updatedListArray, searchAlphaTerm);
  //   // if (searchAlphaTerm) {
  //   //   updatedListArray = handleAlphabet(leaveData, searchAlphaTerm);
  //   //   console.log("here1",updatedListArray)
  //   //   setLeaveUpdateData(updatedListArray);
  //   // } else {
  //   //   let updatedListArray = [];
  //   //   updatedListArray = handleSearchBar(leaveData, term);
  //   //   updatedListArray = filterLeaveStatus(leaveData, term);
  //   //   console.log("here",updatedListArray)
  //   // }
  //   setAttendenceUpdateData(updatedListArray);
  // }

  // const filterLeaveStatus = (updatedListArray, term) => {
  //   console.log(updatedListArray)
  //   return updatedListArray.filter((records) => {
  //     return (
  //       records.work_from.toLowerCase().search(term.toLowerCase()) !== -1
  //     );
  //   });
  //   // setLeaveUpdateData(newValue)
  // }

  // const handleAlphabet = (attendenceData, searchAlphaTerm) => {
  //   return attendenceData.filter((records) => {
  //     return (
  //       records.user_id.name
  //         .charAt(0)
  //         .toLowerCase()
  //         .search(searchAlphaTerm.toLowerCase()) !== -1
  //     );
  //   });
  // };

  // const handleSearchBar = (updatedListArray, term) => {
  //   return updatedListArray.filter((records) => {
  //     return (
  //       records.user_id.name.toLowerCase().search(term.toLowerCase()) !== -1 || records.user_id.emp_id.toLowerCase().search(term.toLowerCase()) !== -1
  //     );
  //   });
  // };

  // const handleSearch = (event) => {
  //   setSearchAlphaTerm(event.target.text);
  //   const alphabet = event.target.text;
  //   if (searchTerm || optionValue) {
  //     let updatedListArray = [];
  //     updatedListArray = handleSearchBar(attendenceData, searchTerm);
  //     updatedListArray = handleAlphabet(updatedListArray, alphabet);
  //     updatedListArray = filterLeaveStatus(updatedListArray, optionValue);

  //     setAttendenceUpdateData(updatedListArray);
  //   } else {
  //     const updatedListArray = handleAlphabet(attendenceData, alphabet);
  //     setAttendenceUpdateData(updatedListArray);
  //   }
  // };

  const resetSearch = () => {
    setInitialValue("");
    setSearchValue("");
    setOptionValue("");
    updatedList = "";
    page = 0;
    initialValue = "";
    searchValue = "";
    optionValue = "";
    getTodayReport(initialValue, searchValue, optionValue, page);
  };

  useEffect(() => {
    getTodayReport();
    resetSearch();
  }, [renderList]);

  const getTodayReport = async (
    initValue,
    searchInitValue,
    optionInitValue,
    page
  ) => {
    try {
      setLoading(true);
      setPage(page + 1);
      httpClient
        .get(
          `${ATTENDENCE.GET_TODAY_REPORT}?page=${
            page + 1
          }&alphaTerm=${initValue}&searchText=${searchInitValue}&optionTerm=${optionInitValue}`
        )
        .then((res) => {
          if (res.status === 200) {
            if (updatedList.length <= 0) {
              setDataToBind(res.data.usersCount.data.filter((x) => x.user_id));
              setDataBind(res.data.usersCount.total);
              setLoading(false);
            } else {
              const updatedData = [
                ...updatedList,
                ...res.data.usersCount.data.filter((x) => x.user_id),
              ];
              setDataToBind(updatedData);
              setDataBind(res.data.usersCount.total);
              setLoading(false);
            }
          }
        })
        .catch((err) => {
          console.log(err);
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
    response.map((data) => {
      let breakTime = [];
      data.breaks.map((getTime) => {
        if (getTime.start && getTime.end) {
          const startTime = moment(getTime.start);
          const endTime = moment(getTime.end);
          const mins = endTime.diff(startTime, "s");
          breakTime.push(mins);
        }
      });
      if (data.breaks.length) {
        let breaksStatusValue = data.breaks[data.breaks.length - 1];
        if (breaksStatusValue.start && !breaksStatusValue.end) {
          let status = 1;
          data.breakStatus = status;
        }
      } else {
        let status = 0;
        data.breakStatus = status;
      }
      let totalBreak = breakTime.reduce((a, b) => a + b, 0);
      var hours = totalBreak / 3600;
      var breakHour = Math.floor(hours);
      var minutes = (hours - breakHour) * 60;
      var breakMinutes = Math.round(minutes);
      if (breakHour == 0 && breakMinutes == 0) {
        data.totalTime = "-";
      } else {
        data.totalTime = breakHour + " Hr " + breakMinutes + " Mins";
      }
    });
    setAttendenceData(response);
    setAttendenceUpdateData(response);
  };

  return (
    <div className="col-lg-12 order-5 order-lg-5">
      <div className="dashboard_card employee_lists">
        <div className="card_title calender_heading">
          <h4>Today Report List</h4>
          <div className="d-lg-flex w-90 justify-content-end">
            <div className="col-lg-3 me-lg-3 mb-3 mb-lg-0">
              <div className="dropdown_icon">
                <select
                  className="form-control rounded-50"
                  aria-label="Default select example"
                  onChange={handleOptionValue}
                  value={optionValue}
                >
                  <option value="">Work Status</option>
                  <option value="home">WFH</option>
                  <option value="office">WFO</option>
                </select>
              </div>
            </div>
            <form onSubmit={handleSearchValue}>
              <div className="form-group has-search">
                <span className="fa fa-search form-control-feedback"></span>
                <input
                  required
                  type="text"
                  className="form-control"
                  placeholder="Search by name"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  // onChange={handleSearchValue}
                />
              </div>
            </form>
            <button
              className="btn btn-primary text-nowrap"
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
              <li key={i} className={initialValue === data ? "active" : ""}>
                <a href="#" data-target={data} onClick={handleInitialValue}>
                  {data}
                </a>
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
                  Time In
                </th>
                <th scope="col" className="textCenter">
                  Break Time{" "}
                </th>
                <th scope="col" className="textCenter">
                  Time Out
                </th>
                <th scope="col" className="textCenter">
                  Total Time
                </th>
                <th scope="col" className="textCenter">
                  Work Status
                </th>
                <th scope="col" className="textCenter">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {updatedList &&
                updatedList.map((data, i) => (
                  <tr key={i}>
                    <td scope="row">{data.user_id ? data.user_id.name : ""}</td>
                    <td className="textCenter">
                      {data.user_id ? data.user_id.emp_id : ""}
                    </td>
                    <td className="textCenter">
                      {data.user_id
                        ? moment(data.check_in).format("hh:mm A")
                        : ""}
                    </td>
                    <td className="textCenter">{data.totalTime}</td>
                    <td className="textCenter">
                      {data.check_out ? (
                        moment(data.check_out).format("hh:mm A")
                      ) : (
                        <div>-</div>
                      )}
                    </td>
                    <td className="textCenter">
                      {data.working_hours ? (
                        data.working_hours ? (
                          <div>{data.working_hours} Hr</div>
                        ) : (
                          <div>-</div>
                        )
                      ) : (
                        <div>-</div>
                      )}{" "}
                    </td>
                    <td className="textCenter">
                      <div className="d-flex align-item-center justify-content-center">
                        <span
                          className={
                            data.check_out
                              ? "request_empty request_rised"
                              : data.breakStatus == 1
                              ? "request_empty break_status"
                              : "request_empty"
                          }
                        >
                          {" "}
                        </span>
                        <span className="ms-2">
                          (
                          {data
                            ? data.work_from === "office"
                              ? "WFO"
                              : "WFH"
                            : "-- : --"}
                          )
                        </span>
                      </div>
                    </td>
                    <td className="textCenter d-flex">
                      <Link
                        to={`/employee/attendence-detail/${
                          data.user_id ? data.user_id.id : ""
                        }`}
                      >
                        <button
                          title="Attendence Detail"
                          className="view_emp_detail table_btn mx-1"
                        >
                          <i
                            className="fa fa-hand-paper-o"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </Link>
                      {/* <Link to={{ pathname: `/employee/edit/?id=${data.user_id?data.user_id.id:''}`}}>
                      <button title="Edit Employee"
                        className="edit_emp_detail table_btn mx-1" style={{cursor:'pointer'}}
                        disabled
                      >
                        <i
                          className="fa fa-pencil-square-o"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </Link> */}
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
          {updatedList.length <= 0 ||
            (updatedList.length < total && (
              <div className="text-center">
                <InfiniteScroll
                  dataLength={updatedList?.length}
                  next={fetchMoreData}
                  hasMore={true}
                  // loader={
                  //   initialValue || searchValue || optionValue ? (
                  //     ""
                  //   ) : (
                  //     <h4>Loading...</h4>
                  //   )
                  // }
                  loader={<h4>Loading...</h4>}
                >
                  {updatedList.map((i, index) => (
                    <div key={index}></div>
                  ))}
                </InfiniteScroll>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AttendenceDetail;
