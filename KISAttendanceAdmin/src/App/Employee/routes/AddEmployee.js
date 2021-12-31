import React, { useState, useEffect, useRef } from "react";
import { ToastsStore } from "react-toasts";
import { httpClient } from "../../../constants/Api";
import { useHistory } from "react-router";
import { ROLES } from "../../../constants/AppConstants";
import { uploadS3Image } from "../../../Utils/UploadImage";
import UploadImage from "../../../assets/images/dummy_profile.jpeg";
import { USER } from "../../../constants/AppConstants";
import moment from "moment";

function Employee() {
  let history = useHistory();
  const titleRef = useRef();
  const [values, setValues] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [employeeRegex, setEmployeeRegex] = useState("");
  const [employeeRegexClass, setEmployeeRegexClass] = useState("mb-4 col-lg-6");
  const [focusClass, setFocusClass] = useState("mb-4 col-lg-6");
  const [uploadedImage, setUploadedImage] = useState("");
  const [roles, setRoles] = useState([]);
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    const getRoles = async () => {
      await httpClient
        .get(ROLES.GET_USER_ROLE)
        .then((res) => {
          if (res.status === 200) {
            setRoles(res.data);
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
    getRoles();
  }, []);

  const addEmployeeSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    values.working_hour = String(
      parseInt(values.out_time) - parseInt(values.in_time)
    );
    values.status = true;
    if (imageURL) {
      values.profile_image = imageURL;
    }

    if (employeeRegex) {
      return;
    }
    try {
      await httpClient
        .post(USER.ADD_USER, values)
        .then((res) => {
          if (res.status === 201) {
            ToastsStore.success("User registered successfully");
            setLoading(false);
            history.push("/employee/list");
          }
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response) {
            if (err.response.data.message === "Error: Email already exist!") {
              setErrorEmail("Email already exist!");
              setFocusClass("mb-4 col-lg-6 error-focus");
            } else if (
              err.response.data.message === "Error: Employee ID already exist!"
            ) {
              setEmployeeRegex("Employee ID already exist!");
              setEmployeeRegexClass("mb-4 col-lg-6 error-focus");
            } else {
              ToastsStore.error(err.response.data.message);
            }
          } else {
            ToastsStore.error("Something went wrong");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };
  // const user = useSelector((state) => state.user.user.user.name);
  const handleClick = async () => {
    setLoading(true);
    const fileInput = titleRef;
    const dirName = "porfile-images";
    let reader = new FileReader();
    reader.readAsDataURL(titleRef.current.files[0]);
    reader.onloadend = function (e) {
      setUploadedImage([reader.result]);
    };
    const imageURL = await uploadS3Image(fileInput, dirName);
    setImageURL(imageURL.location);
    setLoading(false);
  };

  const setEmpValue = (e) => {
    e.preventDefault();
    setValues({ ...values, emp_id: e.target.value });
    const regex = new RegExp(
      "^KIS/[A-Z][A-Z][A-Z]?/2[0-9][1-9][0-9]/[0-9][0-9]?[0-9]?$"
    );
    const matchEmpId = regex.test(e.target.value);
    if (!matchEmpId) {
      setEmployeeRegex("Please enter correct Employee ID");
      setEmployeeRegexClass("mb-4 col-lg-6 error-focus");
      return;
    } else {
      setEmployeeRegex("");
      setEmployeeRegexClass("mb-4 col-lg-6");
    }
  };
  return (
    <>
      <div className="main_content_panel">
        <div className="header_title">
          <h1>
            {" "}
            Add<span> Employee Details</span>
          </h1>
        </div>
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="dashboard_card">
              <div className="employee_profile">
                <form
                  className=""
                  auto-complete="off"
                  onSubmit={addEmployeeSubmit}
                >
                  <div className="row">
                    <div className="mb-4 col-lg-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        value={values.name}
                        onChange={(e) =>
                          setValues({ ...values, name: e.target.value })
                        }
                        required
                        className="form-control"
                        placeholder="Enter Full Name"
                      />
                    </div>
                    <div className={focusClass}>
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={values.email}
                        onChange={(e) =>
                          setValues({ ...values, email: e.target.value })
                        }
                        required
                        className="form-control"
                        placeholder="Enter Email"
                      />
                      <small style={{ color: "red" }} role="alert">
                        {errorEmail}
                      </small>
                    </div>
                    <div className={employeeRegexClass}>
                      <label className="form-label">Employee ID</label>
                      <input
                        type="text"
                        value={values.emp_id}
                        onChange={setEmpValue}
                        required
                        className="form-control"
                        placeholder="Enter Employee ID"
                      />
                      <small style={{ color: "red" }} role="alert">
                        {employeeRegex}
                      </small>
                    </div>
                    <div className="mb-4 col-lg-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        value={values.phone}
                        onChange={(e) =>
                          setValues({ ...values, phone: e.target.value })
                        }
                        required
                        minLength="10"
                        maxLength="10"
                        className="form-control"
                        placeholder="Enter Phone Number"
                      />
                    </div>
                    <div className="mb-4 col-lg-6">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        value={values.dob}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            dob: e.target.value,
                          })
                        }
                        required
                        max={moment().format("YYYY-MM-DD")}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-4 col-lg-6">
                      <label className="form-label">In Time</label>
                      <input
                        type="time"
                        value={values.in_time}
                        onChange={(e) =>
                          setValues({ ...values, in_time: e.target.value })
                        }
                        required
                        className="form-control"
                        placeholder="Enter In Time"
                      />
                    </div>
                    <div className="mb-4 col-lg-6">
                      <label className="form-label">Out Time</label>
                      <input
                        type="time"
                        value={values.out_time}
                        onChange={(e) =>
                          setValues({ ...values, out_time: e.target.value })
                        }
                        required
                        className="form-control"
                        placeholder="Enter Out Time"
                      />
                    </div>
                    <div className="mb-4 col-lg-6">
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        value={values.designation}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            designation: e.target.value,
                          })
                        }
                        required
                        className="form-control"
                        placeholder="Enter Designation"
                      />
                    </div>

                    <div className="col-lg-6 select_role">
                      <p>Select your role</p>
                      <select
                        className="form-control"
                        aria-label="Default select example"
                        value={values.role}
                        onChange={(e) =>
                          setValues({ ...values, role: e.target.value })
                        }
                        required
                      >
                        <option value="">Select your role</option>
                        {roles.length > 0 &&
                          roles.map((r, i) => (
                            <option value={r._id} key={i}>
                              {r.role}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="mb-4 col-lg-6">
                      <label className="form-label">Date of Joining</label>
                      <input
                        type="date"
                        value={values.doj}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            doj: e.target.value,
                          })
                        }
                        required
                        className="form-control"
                        placeholder="Enter Designation"
                      />
                    </div>
                    <div className="mb-4 col-lg-6">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={values.password}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            password: e.target.value,
                          })
                        }
                        required
                        pattern="(?=.*\d)(?=.*[a-zA-Z]).{8,}"
                        title="Must contain at least one number and one letter, and at least 8 or more characters."
                        className="form-control"
                        placeholder="Enter Password"
                      />
                    </div>
                    <div className="mb-4 col-lg-6">
                      <label className="form-label">Allotted Leaves</label>
                      <input
                        type="number"
                        value={values.allotted_leaves}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            allotted_leaves: e.target.value,
                          })
                        }
                        step="any"
                        maxLength="5"
                        className="form-control"
                        placeholder="Enter Allotted Leaves"
                      />
                    </div>
                    <div className="mb-5 col-lg-12">
                      <label className="form-label">Upload Profile Image</label>
                      <div className="profile-pic">
                        <label className="-label" htmlFor="file">
                          <span className="glyphicon glyphicon-camera"></span>
                          <span>
                            {!isLoading ? "Change Image" : "Uploading..."}
                          </span>
                        </label>
                        <input
                          id="file"
                          type="file"
                          onChange={handleClick}
                          ref={titleRef}
                          accept="image/*"
                        />
                        <img
                          src={uploadedImage ? uploadedImage : UploadImage}
                          id="output"
                          width="200"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <button type="submit" className="btn btn-leave_status">
                        Submit Details
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    // </div>
  );
}

export default Employee;
