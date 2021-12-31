const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { leavesService } = require('../services');
const { getUserIdToken } = require('../middlewares/auth');

const applyForLeave = catchAsync(async (req, res) => {
  const userId = await getUserIdToken(req.headers['authorization']);
  await leavesService.applyForLeave(req.body, userId);
  res.status(httpStatus.OK).send({ message: 'Applied Successfully.' });
});

const userLeaves = catchAsync(async (req, res) => {
  const userId = await getUserIdToken(req.headers['authorization']);
  const leaves = await leavesService.getUserLeaves(userId,req.query.page);
  res.status(httpStatus.OK).send({leaves});
});

const getUserPendingLeaves = catchAsync(async (req, res) => {
  const leaves = await leavesService.getUserPendingLeaves(req.params.userId);
  res.status(httpStatus.OK).send(leaves);
});

const getUserLeaves = catchAsync(async (req, res) => {
  const leaves = await leavesService.getUserLeaves(req.params.userId,req.query.page);
  res.status(httpStatus.OK).send({leaves});
});

const getUserDashboardLeaves = catchAsync(async (req, res) => {
  const userId = await getUserIdToken(req.headers['authorization']);
  const leaves = await leavesService.getUserDashboardLeaves(userId,req.params.userId);
  res.status(httpStatus.OK).send(leaves);
});
 

const getEmployeesLeaveHistory = catchAsync(async (req, res) => {
  const leaves = await leavesService.getEmployeesLeaveHistory(req.query);
  res.status(httpStatus.OK).send({leaves});
});

const approveLeave = catchAsync(async (req, res) => {
  await leavesService.approveLeave(req.params.leaveId, req.body);
  res.status(httpStatus.OK).send({ message: 'Approved Successfully.' });
});

const urgentLeave = catchAsync(async (req, res) => {
  await leavesService.urgentLeave(req.params.userId, req.body);
  res.status(httpStatus.OK).send({ message: 'Approved Successfully.' });
});

const rejectLeave = catchAsync(async (req, res) => {
  await leavesService.rejectLeave(req.params.leaveId, req.body);
  res.status(httpStatus.OK).send({ message: 'Rejected Successfully.' });
});

const cancelLeave = catchAsync(async (req, res) => {
  await leavesService.cancelLeave(req.params.id);
  res.status(httpStatus.OK).send({ message: 'Cancelled Successfully.' });
});
const cancelApprovedLeave = catchAsync(async (req, res) => {
  await leavesService.cancelApprovedLeave(req.params.leaveId);
  res.status(httpStatus.OK).send({ message: 'Cancelled Successfully.' });
});

const todayLeavesCount = catchAsync(async (req, res) => {
  const usersLeaveCount = await leavesService.todayLeavesCount();
  res.status(httpStatus.OK).send({ usersLeaveCount });
});

module.exports = {
  applyForLeave,
  userLeaves,
  getUserPendingLeaves,
  getUserLeaves,
  getUserDashboardLeaves,
  approveLeave,
  urgentLeave,
  rejectLeave,
  getEmployeesLeaveHistory,
  cancelLeave,
  todayLeavesCount,
  cancelApprovedLeave
};
