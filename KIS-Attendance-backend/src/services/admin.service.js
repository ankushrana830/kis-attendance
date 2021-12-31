const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
// const { User } = require("../models");
const userService = require("./user.service");
const leavesService = require("./leaves.service");
const attendenceService = require("./attendence.service");

const getCount = async () => {
  try {
    const totalUsers = await userService.getUsersCount();
    const presentUsers = await attendenceService.presentUserCount();
    const onLeaveEmployees = await leavesService.todayLeavesCount();
    const uncheckedEmployees = await userService.getUnCheckedEmployees();

    return {
      total: totalUsers,
      present: presentUsers.length,
      onLeave: onLeaveEmployees.length,
      unChecked: uncheckedEmployees.length,
    };
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

module.exports = {
  getCount,
};
