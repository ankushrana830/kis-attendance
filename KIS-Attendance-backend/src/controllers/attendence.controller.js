const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { attendenceService } = require("../services");
const { getUserIdToken } = require("../middlewares/auth");

const getCurrentDate = catchAsync(async (req, res) => {
  const date = await attendenceService.getCurrentDate();
  res.status(httpStatus.OK).send(date);
});

const checkIn = catchAsync(async (req, res) => {
  const userId = await getUserIdToken(req.headers["authorization"]);
  await attendenceService.checkIn(userId, req.body);
  res.status(httpStatus.OK).send({
    message: "check in successfully",
  });
});

const checkOut = catchAsync(async (req, res) => {
  const userId = await getUserIdToken(req.headers["authorization"]);
  await attendenceService.checkOut(userId);
  res.status(httpStatus.OK).send({
    message: "check out successfully",
  });
});

const breakStart = catchAsync(async (req, res) => {
  const userId = await getUserIdToken(req.headers["authorization"]);
  await attendenceService.breakStart(req.body, userId);
  res.status(httpStatus.OK).send({
    message: "break started",
  });
});

const breakEnd = catchAsync(async (req, res) => {
  const userId = await getUserIdToken(req.headers["authorization"]);
  await attendenceService.breakEnd(userId);
  res.status(httpStatus.OK).send({
    message: "break ended",
  });
});
//-----for user
const getAttendenceOfDay = catchAsync(async (req, res) => {
  const userId = await getUserIdToken(req.headers["authorization"]);
  const result = await attendenceService.getAttendenceOfDay(userId);
  res.status(httpStatus.OK).send({
    result,
  });
});
//-----for admin

const getUserCurrentSession = catchAsync(async (req, res) => {
  const result = await attendenceService.getAttendenceOfDay(req.params.userId);
  res.status(httpStatus.OK).send({
    result,
  });
});

const getCurrentMonthAttendence = catchAsync(async (req, res) => {
  const result = await attendenceService.getCurrentMonthAttendence(
    req.params.userId
  );
  res.status(httpStatus.OK).send({
    result,
  });
});

const getSelectedRangeAttendence = catchAsync(async (req, res) => {
  const result = await attendenceService.getSelectedRangeAttendence(
    req.body,
    req.params.userId
  );
  res.status(httpStatus.OK).send({
    result,
  });
});

const getAttendenceOfSpecificDate = catchAsync(async (req, res) => {
  const userId = await getUserIdToken(req.headers["authorization"]);
  const result = await attendenceService.getAttendenceOfSpecificDate(
    userId,
    req.query.date
  );
  res.status(httpStatus.OK).send({
    result,
  });
});

const presentUserCount = catchAsync(async (req, res) => {
  const usersCount = await attendenceService.presentUserCount();
  res.status(httpStatus.OK).send({ usersCount });
});

const todayReport = catchAsync(async (req, res) => {
  const usersCount = await attendenceService.todayReport(req.query);
  res.status(httpStatus.OK).send({ usersCount });
});

const updateAttendence = catchAsync(async (req, res) => {
  await attendenceService.updateAttendence(req.body, req.params.userId);
  res.status(httpStatus.OK).send({ message: "Updated Successfully" });
});
const removeTimeout = catchAsync(async (req, res) => {
  await attendenceService.removeTimeout(req.params.attandenceId);
  res.status(httpStatus.OK).send({ message: "Updated Successfully" });
});

module.exports = {
  getCurrentDate,
  checkIn,
  checkOut,
  breakStart,
  breakEnd,
  getAttendenceOfDay,
  getUserCurrentSession,
  getCurrentMonthAttendence,
  getSelectedRangeAttendence,
  getAttendenceOfSpecificDate,
  presentUserCount,
  todayReport,
  updateAttendence,
  removeTimeout,
};
