import { call, put, takeEvery, fork, all } from "redux-saga/effects";
import { ToastsStore } from "react-toasts";
import { httpClient } from "../../constants/Api";
import { AUTH } from "../../constants/AppConstants";
import {
  SIGNIN_USER,
  SIGNIN_SUCCESS,
  SIGNIN_FAIL,
  SIGNOUT_USER,
  SIGNOUT_USER_FAIL,
  SIGNOUT_USER_SUCCESS,
  FETCH_ROUTE,
} from "../constants/ActionTypes";

const signIn = async (data) => {
  return await httpClient.post(AUTH.LOGIN, data);
};

const logOut = async (data) => {
  return await httpClient.post(AUTH.LOGOUT, data.payload);
};
function* userSignIn(data) {
  try {
    const user = yield call(signIn, data.payload);
    yield put({ type: SIGNIN_SUCCESS, user: user.data });
    yield put({ type: FETCH_ROUTE, route: "/dashboard" });
    localStorage.setItem("tokens", JSON.stringify(user.data.tokens));
    localStorage.setItem("user", JSON.stringify(user.data));
  } catch (err) {
    if (err.response) {
      yield put({ type: SIGNIN_FAIL, message: err.response.data.message });
      ToastsStore.error(err.response.data.message.replace("Error: ", ""));
    } else {
      ToastsStore.error(err || "Something went wrong");
    }
  }
}

function* signOut(data) {
  try {
    const res = yield call(logOut, data);
    yield put({ type: SIGNOUT_USER_SUCCESS, data: res.data });
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
    yield put({ type: FETCH_ROUTE, route: "/login" });
    ToastsStore.success("Logout Successfully");
  } catch (err) {
    yield put({ type: SIGNOUT_USER_FAIL, data: err.message });
    if (err.response) {
      ToastsStore.error(err.response.data.message);
    } else {
      ToastsStore.error("Something went wrong");
    }
  }
}

function* signInUser() {
  yield takeEvery(SIGNIN_USER, userSignIn);
}

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}

export default function* rootSaga() {
  yield all([fork(signInUser), fork(signOutUser)]);
}
