//local url
// export const API_BASE_URL = "http://localhost:3001/v1/";

//live url
export const API_BASE_URL = "https://api.kisattendence.cf/v1";

export const AUTH = {
  LOGIN: "auth/login",
  LOGOUT: "auth/logout",
};

export const USER = {
  GET_USER: "user/get-unchecked-users",
  GET_USER_COUNT: "user/user-count",
  GET_ALL_USER: "user/get-all",
  ADD_USER: "user/add",
  UPLOAD_USER_IMAGE: "user/image-upload",
  GET_BY_ID: "user/get/{id}",
  UPDATE_USER: "user/update-user/{id}",
  DELETE_USER: "user/delete",
  EX_USER: "user/deactivate-employee",
  GET_EX_EMPLOYEES: "user/get-deactivated-employees",
};

export const ATTENDENCE = {
  GET_TODAY_PRESENT: "attendence/today-present-count",
  GET_TODAY_REPORT: "attendence/today-report",
  GET_CURRENT_SESSION: "attendence/get-current-session/{id}",
  GET_CURRENT_MONTH_ATTENDENCE: "attendence/get-current-month-attednence/{id}",
  GET_SELECTED_RANGE_ATTENDENCE:
    "attendence/get-selected-range-attednence/{id}",
  UPDATE_ATTENDENCE: "attendence/update-attednence/{id}",
  DELETE_TIMEOUT: "attendence/remove-timeout/{id}",
};

export const ROLES = {
  GET: "roles/get",
  GET_USER_ROLE: "roles/get-user-role",
};

export const COUNT = {
  GET_COUNT: "admin/get-count",
};

export const LEAVES = {
  GET_LEAVE_COUNT: "leaves/today-leave-count",
  GET_USER_PENDING_LEAVES: "leaves/get-user-pending-leaves/{id}",
  GET_USER_LEAVES: "leaves/get-user-leaves/{id}",
  APPROVE_LEAVE: "leaves/approve/{id}",
  REJECT_LEAVE: "leaves/reject/{id}",
  GET_ALL_EMPLOYEE_LEAVES: "leaves/get-employees-leave",
  URGENT_LEAVE: "leaves/urgent_leave/{id}",
  CANCEL_LEAVE: "admin/cancel-approved-leave/{id}"
};

export const AWS = {
  BUCKET_NAME: "kisattandance",
  REGION: "us-east-2",
  ACCESS_KEY_ID: "AKIA5RHZT24PNJRAIX7Q",
  SECRET_ACCESS_KEY: "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",
};

export const REQUEST = {
  GET_UNSEEN_REQUESTS: "request-changes/get-unseen-requests",
  GET_REQUEST: "request-changes/get-request-changes",
  REMOVE_REQUEST: "request-changes/delete-request-changes",
  UPDATE_SEEN_NOTIFICATIONS: "request-changes/update-seen-notifications",
};

export const THOUGHT = {
  ADD_THOUGHT: "thought/add-thought",
  GET_THOUGHT: "thought/list-thought",
  DELETE_THOUGHT: "thought/delete-thought",
  EDIT_THOUGHT: "thought/post-edit-thought/{id}",
  GET_THOUGHT_BY_ID: "thought/get-edit-thought/{id}"
};
