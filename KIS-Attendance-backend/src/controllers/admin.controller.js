const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { adminService } = require("../services");

const getCount = catchAsync(async (req, res) => {
  const result = await adminService.getCount();
  res.status(httpStatus.OK).send({ result });
});

module.exports = {
  getCount,
};
