import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { userSignOut } from "../../redux/actions/AuthActions";
import CompanyLogo from "../../assets/images/logo.png";
import ProfileImage from "../../assets/images/profile.png";

function Sidebar() {
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state.user.user.user);
  // const route = useSelector((state) => state.route.route);
  const signOut = () => {
    const tokens = JSON.parse(localStorage.getItem("tokens"));
    if (tokens) {
      dispatch(userSignOut({ refreshToken: tokens.refresh.token }));
      window.location.href = "/login";
    }
  };

  return (
    <>
      {/* {route === "/login" && <Redirect to="/login" />} */}
      <div className="left_pannel">
        <Link to="/dashboard/home">
          <div className="logo">
            <img src={CompanyLogo} alt="" />
          </div>
        </Link>
        <div className="profile_info">
          <div className="profile_img">
            <img
              src={
                userDetail
                  ? userDetail.profile_image
                    ? userDetail.profile_image
                    : ProfileImage
                  : ProfileImage
              }
              alt=""
              className="img-fluid w-100"
            />
          </div>
          <h2>{userDetail ? (userDetail.name ? userDetail.name : "") : ""}</h2>
        </div>
        <div className="logout">
          <Link to="#" onClick={() => signOut()}>
            <span className="m-1">
              <FontAwesomeIcon icon={faPowerOff} />
            </span>
            Logout{" "}
          </Link>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
