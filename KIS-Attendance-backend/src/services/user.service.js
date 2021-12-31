const httpStatus = require("http-status");
const { User } = require("../models");
const { ChangeRequests } = require("../models");

const { AttendenceEntries, Token } = require("../models");
// const emailService = require("./email.service");
const ApiError = require("../utils/ApiError");
const { addEmployeeTemplate } = require("../utils/email.template");
const rolesService = require("./roles.service");
const attendenceService = require("./attendence.service");
const leavesService = require("./leaves.service");
const { DataSync } = require("aws-sdk");
/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
  return User.findOne({ emp_id: username }).populate("role");
};
const getUserByEmail = async (email) => {
  return User.findOne({ email: email });
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  try {
    const findEmail = await User.findOne({ email: userBody.email });
    if (findEmail) {
      throw new ApiError(httpStatus.OK, "Email already exist!");
    }
    const findEmpId = await User.findOne({ emp_id: userBody.emp_id });
    if (findEmpId) {
      throw new ApiError(httpStatus.OK, "Employee ID already exist!");
    }
    userBody["pending_leaves"] = userBody.allotted_leaves;
    const user = await User.create(userBody);
    const to = userBody.email;
    const subject = "Regsiter email";
    const text = addEmployeeTemplate(
      userBody.name,
      userBody.emp_id,
      userBody.password
    );
    // await emailService.sendEmail(to, subject, text);
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

//get all except admin
const getAllEmployees = async (request) => {
  try {
    let skip = 0;
    const limit = 10;
    skip = request.page >= 1 ? (request.page - 1) * limit : skip;
    const roles = await rolesService.getUsersRoles();
    const role = roles.filter((r) => r.role === "Super Admin");
    const totalItems = await User.find({
      role: { $ne: role[0]._id },
      isExEmployee: { $ne: true },
    }).countDocuments();
    let requests = [];
    let searchByInitial = request.alphaTerm ? request.alphaTerm.toLowerCase() : '';
    let searchByText = request.searchText ? request.searchText.toLowerCase() : '';
    if (request.alphaTerm || request.searchText){
       requests = await User.find({
        role: { $ne: role[0]._id },
        isExEmployee: { $ne: true },
        $and: [
          { "name": { $regex: '^' + searchByInitial, $options: 'i' } },
        ],
        $or: [
          { "name":  { $regex: '.*' + searchByText + '.*'  } },
          { "emp_id": { $regex: '.*' + searchByText + '.*'  } },
        ],
    
    }).skip(skip)
        .limit(limit).populate("role");
    }else{
      requests = await User.find({
        role: { $ne: role[0]._id },
        isExEmployee: { $ne: true },
      }).skip(skip)
      .limit(limit).populate("role");
    }
    return{
      total: totalItems,
      data: requests,
      // userData: datas,
    }

  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

//get only whose role is employee
const getUnCheckedEmployees = async () => {
  try {
    const roles = await rolesService.getUsersRoles();
    const role = roles.filter((r) => r.role === "Employee");
    const total = await User.find({
      role: role[0]._id,
      isExEmployee: { $ne: true },
    }).populate("role");
    const presentUsers = await attendenceService.presentUserCount();
    const onLeaveUsers = await leavesService.todayLeavesCount();
    let unchecked = [];
    for (let emp of total) {
      if (
        !presentUsers.find(
          (usr) => String(emp.id) === String(usr.user_id._id)
        ) &&
        !onLeaveUsers.find((usr) => String(emp.id) === String(usr.user_id._id))
      ) {
        unchecked.push(emp);
      }
    }
    return unchecked;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

// Get total employee
const getUsersCount = async () => {
  try {
    const roles = await rolesService.getUsersRoles();
    const role = roles.filter((r) => r.role === "Super Admin");
    return await User.countDocuments({
      role: { $ne: role[0]._id },
      isExEmployee: { $ne: true },
    });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  try {
    return User.findById(id)
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const findEmpId = await User.findOne({
    _id: userId,
    emp_id: updateBody.emp_id,
  });
  const findEmp = await User.findOne({ emp_id: updateBody.emp_id });
  if (findEmpId) {
    Object.assign(user, updateBody);
  } else if (findEmp) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee ID already exist!");
  } else {
    Object.assign(user, updateBody);
  }
  await user.save();
  return user;
};

/**
 * Change password
 * @param {string} oldPassword
 * @param {string } newPassword
 */

const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    if (!user || !(await user.isPasswordMatch(oldPassword))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect old password");
    }
    user.password = newPassword;
    await user.save();
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, error);
  }
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {string} password
 * @returns {Promise<User>}
 */
const matchPassword = async (userId, password) => {
  try {
    const user = await getUserById(userId);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect  password");
    }
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, error);
  }
};

/**
 * Update user by id
 * @param {array} data
 * @returns {Promise<User>}
 */
const deleteUser = async (data) => {
  try {
    await User.deleteMany({ _id: { $in: data.userId } });
    await AttendenceEntries.deleteMany({ user_id: data.userId });
    await Token.deleteMany({ user: data.userId });
    await ChangeRequests.deleteMany({ user_id: data.userId });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

/**
 * Update user by id
 * @param {array} data
 * @returns {Promise<User>}
 */
const deactivateEmployee = async (data) => {
  try {
    const user = await getUserById(data.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    data.isExEmployee = true;
    Object.assign(user, data);
    await user.save();
    await ChangeRequests.deleteMany({ user_id: data.userId });
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};
const getDeactivatedEmployees = async () => {
  try {
    const roles = await rolesService.getUsersRoles();
    const role = roles.filter((r) => r.role === "Super Admin");
    return await User.find({
      role: { $ne: role[0]._id },
      isExEmployee: true,
    }).populate("role");
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

const getAllBday = async () => {
  var moment = require('moment')
  try {
    return await User.find({ isExEmployee: false });
  } catch (err) {
    throw new ApiError(httpStatus.NOT_MODIFIED, err)
  }
}

module.exports = {
  createUser,
  getUnCheckedEmployees,
  getAllEmployees,
  queryUsers,
  getUserById,
  getUserByEmail,
  getDeactivatedEmployees,
  getUserByUsername,
  updateUserById,
  changePassword,
  matchPassword,
  deactivateEmployee,
  deleteUser,
  getUsersCount,
  getAllBday,
};
