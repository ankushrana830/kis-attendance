const httpStatus = require('http-status');
const moment = require('moment');
const { Leaves, ChangeRequests, User } = require('../models');
const ApiError = require('../utils/ApiError');
// const userService = require("./user.service");
const emailService = require('./email.service');
const attendenceService = require('./attendence.service');
const config = require('../config/config');
const { leaveTemplate } = require('../utils/leaveEmail.template');

const findUserById = async (id) => {
  try {
    return User.findById(id);
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

const applyForLeave = async (body, userId) => {
  try {
    const leave = await Leaves({ ...body, user_id: userId });
    await leave.save();
    const user = await findUserById(userId);
    const leaveRequest = {
      user_id: userId,
      request_message: `${user.name} has applied for leave`,
      type: 'Leave Request',
    };
    const notification = await ChangeRequests({ ...leaveRequest });
    await notification.save();
    const to = config.email.to;
    const subject = 'Leave application';
    const text = leaveTemplate(user, body);
    await emailService.sendEmail(to, subject, text);
    return leave;
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, error);
  }
};

const getUserPendingLeaves = async (userId) => {
  try {
    return await Leaves.find({ user_id: userId, status: 'pending' });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

const getUserLeaves = async (userId, page) => {
  try {
    let skip = 0;
    const limit = 10;
    skip = page >= 1 ? (page - 1) * limit : skip;
    const totalItems = await Leaves.find({ user_id: userId }).countDocuments();
    const requests = await Leaves.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return {
      total: totalItems,
      data: requests,
    }
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

const getUserDashboardLeaves = async (userId) => {
  try {
    return await Leaves.find({ user_id: userId }).sort({ createdAt: -1 });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

const getEmployeesLeaveHistory = async (request) => {
  try {
    let skip = 0;
    const limit = 10;
    skip = request.page >= 1 ? (request.page - 1) * limit : skip;
    const totalItems = await Leaves.find().sort({ createdAt: -1 }).countDocuments();
    let requests = [];
    let searchByInitial = request.alphaTerm ? request.alphaTerm.toLowerCase() : '';
    let searchByText = request.searchText ? request.searchText.toLowerCase() : '';
    let searchByTerm = request.optionTerm ? request.optionTerm.toLowerCase() : '';
    if (request.alphaTerm || request.searchText || request.optionTerm) {
      requests = await Leaves.aggregate(
        [
          {
            $lookup: {
              from: 'users',
              localField: "user_id",
              foreignField: "_id",
              as: "user_id"
            }
          },
          {
            $match: {
              $and: [
                {
                  "user_id.name": { $regex: '^' + searchByInitial, $options: 'i' },
                },
                {
                  "status": { $regex: searchByTerm ,$options: 'i' }
                }
              ],
              $or: [
                {
                  "user_id.emp_id": { $regex:  searchByText, $options: 'i'  },
                },
                {
                  "user_id.name": { $regex: '.*' + searchByText + '.*'  },
                },
              ]
            }
          },
        ],
      ).sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        
    } else {
      requests = await Leaves.aggregate(
        [
          {
            $lookup: {
              from: 'users',
              localField: "user_id",
              foreignField: "_id",
              as: "user_id"
            }
          },

        ],
      ).sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

    }
    const leave = await Leaves.find().sort({ createdAt: -1 }).populate("user_id");

    return {
      total: totalItems,
      data: requests,
      leave: leave,
    }
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

const approveLeave = async (leaveId, body) => {
  try {
    const res = await Leaves.updateOne({ _id: leaveId }, { $set: body });
    const leave = await Leaves.findById(leaveId);
    let user = await findUserById(leave.user_id);
    if (user.pending_leaves || user.pending_leaves === 0) {
      await manageUserLeaves(user, leave);
    }
    return res;
  } catch (err) {
    throw new ApiError(httpStatus.NOT_MODIFIED, err);
  }
};

const urgentLeave = async (userId, body) => {
  try {
    const leave = await Leaves({ ...body, user_id: userId });
    await leave.save();
    await attendenceService.checkOut(userId);
    const user = await findUserById(userId);
    if (user.pending_leaves || user.pending_leaves === 0) {
      await manageUserLeaves(user, body);
    }
    const leaveRequest = {
      user_id: userId,
      request_message: `${user.name} has applied for leave`,
      type: 'Leave Request',
    };
    const notification = await ChangeRequests({ ...leaveRequest });
    await notification.save();
    return leave;
  } catch (err) {
    throw new ApiError(httpStatus.NOT_MODIFIED, err);
  }
};

const manageUserLeaves = async (user, leave) => {
  try {
    let remainingLeaves;
    if (leave.type === 'Full Day') {
      if (moment(leave.from).isSame(moment(leave.to), 'days')) {
        remainingLeaves = user.pending_leaves - 1;
      } else {
        const diff = moment(leave.to).diff(moment(leave.from), 'days') + 1;
        remainingLeaves = user.pending_leaves - diff;
      }
    } else if (leave.type === 'Half Day') {
      remainingLeaves = user.pending_leaves - 0.5;
    } else if (leave.type === 'Short Leave') {
      remainingLeaves = user.pending_leaves - 0.25;
    }
    user.pending_leaves = remainingLeaves;
    await user.save();
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

const rejectLeave = async (leaveId, body) => {
  try {
    const res = await Leaves.updateOne({ _id: leaveId }, { $set: body });
    return res;
  } catch (err) {
    throw new ApiError(httpStatus.NOT_MODIFIED, err);
  }
};

const cancelLeave = async (id) => {
  try {
    const body = {
      status: 'cancelled',
    };
    const res = await Leaves.updateOne({ _id: id }, { $set: body });
    return res;
  } catch (err) {
    throw new ApiError(httpStatus.NOT_MODIFIED, err);
  }
};

const cancelApprovedLeave = async (id) => {
  try {
    const body = {
      status: 'cancelled',
    };
    const res = await Leaves.updateOne({ _id: id }, { $set: body });
    const leave = await Leaves.findById(id);
    let user = await findUserById(leave.user_id);
    let remainingLeaves;
    if (leave.type === 'Full Day') {
      if (moment(leave.from).isSame(moment(leave.to), 'days')) {
        remainingLeaves = user.pending_leaves + 1;
      } else {
        const diff = moment(leave.to).diff(moment(leave.from), 'days') + 1;
        remainingLeaves = user.pending_leaves + diff;
      }
    } else if (leave.type === 'Half Day') {
      remainingLeaves = uuser.pending_leaves + 0.5;
    } else if (leave.type === 'Short Leave') {
      remainingLeaves = user.pending_leaves + 0.25;
    }
    user.pending_leaves = remainingLeaves;
    await user.save();
    return res;
  } catch (err) {
    throw new ApiError(httpStatus.NOT_MODIFIED, err);
  }
};

//Get today leave count
const todayLeavesCount = async () => {
  try {
    const leaves = await Leaves.find({
      from: {
        $gte: moment().subtract(20, 'days'),
      },
      to: { $lt: moment().add(20, 'days') },
      status: 'approved',
    }).populate('user_id');
    const todayLeaveCount = leaves.filter(
      (l) =>
        moment().isBetween(moment(l.from), moment(l.to)) || (moment().isSame(l.from, 'day') && moment().isSame(l.to, 'day'))
    );
    return todayLeaveCount;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

module.exports = {
  applyForLeave,
  getUserLeaves,
  getUserPendingLeaves,
  approveLeave,
  urgentLeave,
  rejectLeave,
  getEmployeesLeaveHistory,
  cancelLeave,
  todayLeavesCount,
  findUserById,
  manageUserLeaves,
  cancelApprovedLeave,
  getUserDashboardLeaves,
};
