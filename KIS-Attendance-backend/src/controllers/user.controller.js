const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, imageUploadService,tokenService } = require('../services');
const { getUserIdToken } = require('../middlewares/auth');

const addEmployee = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ user });
});

const getAllEmployees = catchAsync(async (req, res) => {
  const user = await userService.getAllEmployees(req.query);
  res.status(httpStatus.OK).send({ user });
});

const getUnCheckedEmployees = catchAsync(async (req, res) => {
  const user = await userService.getUnCheckedEmployees();
  res.status(httpStatus.OK).send({ user });
});

const getUsersCount = catchAsync(async (req, res) => {
  const usersCount = await userService.getUsersCount();
  res.status(httpStatus.OK).send({ users: usersCount });
});

const deleteEmployee = catchAsync(async (req, res) => {
  await userService.deleteUser(req.body);
  res.status(httpStatus.OK).send({ message: "Deleted Successfully" });
});

const deactivateEmployee = catchAsync(async (req, res) => {
  await userService.deactivateEmployee(req.body);
  res
    .status(httpStatus.OK)
    .send({ message: "Employee Deactivated Successfully" });
});

//for admin
const getUser = catchAsync(async (req, res) => {
  const result = await userService.getUserById(req.params.userId);
  res.status(httpStatus.OK).send({ user: result });
});

//for user
const getUserByToken = catchAsync(async (req, res) => {
  const userId = await getUserIdToken(req.headers["authorization"]);
  const user = await userService.getUserById(userId);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const updateUser = catchAsync(async (req, res) => {
  const userId = await getUserIdToken(req.headers["authorization"]);
  await userService.updateUserById(userId, req.body);
  res.status(httpStatus.OK).send({ message: "Updated Successfully" });
});

const updateSingleUser = catchAsync(async (req, res) => {
  await userService.updateUserById(req.params.userId, req.body);
  res.status(httpStatus.OK).send({ message: "Updated Successfully" });
});

const uploadImage = catchAsync(async (req, res) => {
  await imageUploadService.uploadImage(req);
  res.status(httpStatus.OK).send({ message: "Updated Successfully" });
});

const getDeactivatedEmployees = catchAsync(async (req, res) => {
  const user = await userService.getDeactivatedEmployees();
  res.status(httpStatus.OK).send({ user });
});
 
const getAllBday = catchAsync(async(req,res) => {
  const bday = await userService.getAllBday();
  res.status(httpStatus.OK).send({ bday });
})
module.exports = {
  addEmployee,
  getUnCheckedEmployees,
  updateSingleUser,
  getAllEmployees,
  deleteEmployee,
  getUser,
  updateUser,
  uploadImage,
  deactivateEmployee,
  getUsersCount,
  getDeactivatedEmployees,
  getUserByToken,
  getAllBday,
};
