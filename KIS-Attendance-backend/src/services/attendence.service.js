const httpStatus = require('http-status');
const moment = require('moment');
const { AttendenceEntries, User } = require('../models');
const ApiError = require('../utils/ApiError');

const getCurrentDate = () => {
  return moment().format();
};

const checkIn = async (userId, body) => {
  try {
    const user = await User.findById(userId);
    const attendence = await AttendenceEntries({
      ...body,
      user_id: userId,
      user_name: user.name,
      emp_id: user.emp_id,
      check_in: moment(),
      entry_date: moment(),
    });
    await attendence.save();
    return attendence;
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, err);
  }
};

const checkOut = async (userId) => {
  try {
    const res = await AttendenceEntries.updateOne(
      {
        entry_date: {
          $gte: moment().startOf('day'),
          $lt: moment().endOf('day'),
        },
        user_id: userId,
      },
      { $set: { check_out: moment() } }
    );
    const attendence = await getAttendenceOfDay(userId);
    if (attendence) {
      await getTotalWorkingHours(attendence);
    }
    return res;
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, err);
  }
};

const updateAttendence = async (body, userId) => {
  const res = await AttendenceEntries.updateOne(
    {
      entry_date: {
        $gte: moment(body.entry_date).startOf('day'),
        $lt: moment(body.entry_date).endOf('day'),
      },
      user_id: userId,
    },
    { $set: body }
  );
  const attendence = await getAttendenceOfSpecificDate(userId, body.entry_date);
  if (attendence.check_out) {
    await getTotalWorkingHours(attendence);
  }
  return res;
};

const removeTimeout = async (attandenceId) => {
  try {
    await AttendenceEntries.updateOne({ _id: attandenceId }, { $unset: { check_out: '', working_hours: '' } });
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, err);
  }
};

const breakStart = async (body, userId) => {
  try {
    const entry = await AttendenceEntries.findOne({
      entry_date: { $gte: moment().startOf('day'), $lt: moment().endOf('day') },
      user_id: userId,
    });
    body['start'] = moment();

    entry.breaks.push(body);
    return await entry.save();
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, err);
  }
};

const breakEnd = async (userId) => {
  try {
    const data = await AttendenceEntries.findOne({
      entry_date: { $gte: moment().startOf('day'), $lt: moment().endOf('day') },
      user_id: userId,
    });
    let lastBreak = data.breaks[data.breaks.length - 1];
    lastBreak['end'] = moment();
    return await data.save();
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, err);
  }
};
const presentUserCount = async () => {
  try {
    return await AttendenceEntries.find({
      entry_date: {
        $gte: moment().startOf('day'),
        $lt: moment().endOf('day'),
      },
    }).populate({
      path: 'user_id',
      match: { isExEmployee: { $ne: true } },
    });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

//Get today report list
const todayReport = async (request) => {
  try {
    let skip = 0;
    const limit = 10;
    skip = request.page >= 1 ? (request.page - 1) * limit : skip;
    const searchByInitial = request.alphaTerm ? request.alphaTerm.toLowerCase() : '';
    const searchByText = request.searchText ? request.searchText : '';
    const searchByTerm = request.optionTerm ? request.optionTerm.toLowerCase() : '';
    let requests = [];
    let totalItems = 0;
    if (!!searchByText && !searchByTerm) {
      totalItems = await AttendenceEntries.find({
        entry_date: {
          $gte: moment().startOf('day'),
          $lt: moment().endOf('day'),
        },
        work_from: { $regex: searchByTerm, $options: 'i' },
        $or: [
          {
            user_name: { $regex: searchByText, $options: 'i' },
          },
          {
            emp_id: searchByText,
          },
        ],
      }).countDocuments();
      requests = await AttendenceEntries.find({
        entry_date: {
          $gte: moment().startOf('day'),
          $lt: moment().endOf('day'),
        },
        work_from: { $regex: searchByTerm, $options: 'i' },
        $or: [
          {
            user_name: { $regex: searchByText, $options: 'i' },
          },
          {
            emp_id: searchByText,
          },
        ],
      })
        .populate({
          path: 'user_id',
          match: { isExEmployee: { $ne: true } },
        })
        .skip(skip)
        .limit(limit);
    } else if (!!searchByTerm && !searchByInitial && !searchByText) {
      totalItems = await AttendenceEntries.find({
        entry_date: {
          $gte: moment().startOf('day'),
          $lt: moment().endOf('day'),
        },
        work_from: { $regex: searchByTerm, $options: 'i' },
      }).countDocuments();
      requests = await AttendenceEntries.find({
        entry_date: {
          $gte: moment().startOf('day'),
          $lt: moment().endOf('day'),
        },
        work_from: { $regex: searchByTerm, $options: 'i' },
      })
        .populate({
          path: 'user_id',
          match: { isExEmployee: { $ne: true } },
        })
        .skip(skip)
        .limit(limit);
    } else if (!!searchByInitial && !searchByTerm) {
      totalItems = await AttendenceEntries.find({
        entry_date: {
          $gte: moment().startOf('day'),
          $lt: moment().endOf('day'),
        },
        user_name: {
          $regex: '^' + searchByInitial,
          $options: 'i',
        },
        work_from: { $regex: searchByTerm, $options: 'i' },
      }).countDocuments();
      requests = await AttendenceEntries.find({
        entry_date: {
          $gte: moment().startOf('day'),
          $lt: moment().endOf('day'),
        },
        work_from: { $regex: searchByTerm, $options: 'i' },
        user_name: {
          $regex: '^' + searchByInitial,
          $options: 'i',
        },
      })
        .populate({
          path: 'user_id',
          match: { isExEmployee: { $ne: true } },
        })
        .skip(skip)
        .limit(limit);
    } else if (!!searchByText && !!searchByTerm) {
      totalItems = await AttendenceEntries.find({
        entry_date: {
          $gte: moment().startOf('day'),
          $lt: moment().endOf('day'),
        },
        work_from: { $regex: searchByTerm },
        $or: [
          {
            user_name: { $regex: searchByText, $options: 'i' },
          },
          {
            emp_id: searchByText,
          },
        ],
      }).countDocuments();
      requests = await AttendenceEntries.find({
        entry_date: {
          $gte: moment().startOf('day'),
          $lt: moment().endOf('day'),
        },
        work_from: { $regex: searchByTerm },
        $or: [
          {
            user_name: { $regex: searchByText, $options: 'i' },
          },
          {
            emp_id: searchByText,
          },
        ],
      })
        .populate({
          path: 'user_id',
          match: { isExEmployee: { $ne: true } },
        })
        .skip(skip)
        .limit(limit);
    } else if (!!searchByInitial && !!searchByTerm) {
      totalItems = await AttendenceEntries.find({
        entry_date: {
          $gte: moment().startOf('day'),
          $lt: moment().endOf('day'),
        },
        user_name: {
          $regex: '^' + searchByInitial,
          $options: 'i',
        },
        work_from: { $regex: searchByTerm },
      }).countDocuments();
      requests = await AttendenceEntries.find({
        entry_date: {
          $gte: moment().startOf('day'),
          $lt: moment().endOf('day'),
        },
        work_from: { $regex: searchByTerm },
        user_name: {
          $regex: '^' + searchByInitial,
          $options: 'i',
        },
      })
        .populate({
          path: 'user_id',
          match: { isExEmployee: { $ne: true } },
        })
        .skip(skip)
        .limit(limit);
    } else {
      totalItems = await AttendenceEntries.find({
        entry_date: {
          $gte: moment().startOf('day'),
          $lt: moment().endOf('day'),
        },
      }).countDocuments();
      requests = await AttendenceEntries.find({
        entry_date: {
          $gte: moment().startOf('day'),
          $lt: moment().endOf('day'),
        },
      })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'user_id',
          match: { isExEmployee: { $ne: true } },
        });
    }
    return {
      total: totalItems,
      data: requests,
      // totalPages,
    };
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

const getAttendenceOfDay = async (userId) => {
  try {
    return await AttendenceEntries.findOne({
      user_id: userId,
      check_in: {
        $gte: moment().startOf('day'),
        $lt: moment().endOf('day'),
      },
    });
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, err);
  }
};

const getAttendenceOfSpecificDate = async (userId, date) => {
  try {
    return await AttendenceEntries.findOne({
      user_id: userId,
      entry_date: {
        $gte: moment(date).startOf('day'),
        $lt: moment(date).endOf('day'),
      },
    });
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, err);
  }
};

const getCurrentMonthAttendence = async (userId) => {
  try {
    return await AttendenceEntries.find({
      user_id: userId,
      entry_date: {
        $gte: moment().startOf('month'),
        $lt: moment().endOf('month'),
      },
    });
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, err);
  }
};

const getSelectedRangeAttendence = async (body, userId) => {
  try {
    return await AttendenceEntries.find({
      user_id: userId,
      entry_date: {
        $gte: moment(body.start),
        $lt: moment(body.end),
      },
    });
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, err);
  }
};

const getTotalWorkingHours = async (attendence) => {
  try {
    const checkIn = moment(attendence.check_in);
    const checkOut = moment(attendence.check_out);
    const duration = moment.duration(checkOut.diff(checkIn));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const breaks = await calculateBreaks(attendence.breaks);
    const breakHours = breaks.get('h');
    const breakMinutes = breaks.get('m');
    const totalWorkingHours = moment(`${hours}:${minutes}`, 'hh:mm').subtract(breakHours, 'h').subtract(breakMinutes, 'm');
    let totalHours = totalWorkingHours.get('h');
    if (/^\d$/.test(totalHours)) {
      totalHours = `0${totalHours}`;
    }
    let totalMinutes = totalWorkingHours.get('m');
    if (/^\d$/.test(totalMinutes)) {
      totalMinutes = `0${totalMinutes}`;
    }
    attendence['working_hours'] = `${totalHours}:${totalMinutes}`;
    attendence.save();
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

const calculateBreaks = async (breaks) => {
  const breaksTime = moment().utcOffset(0);
  breaksTime.set({ hours: 0, minutes: 0, seconds: 0 });
  breaksTime.toISOString();
  breaksTime.format();
  for (i = 0; i < breaks.length; i++) {
    const start = moment(breaks[i].start);
    const end = moment(breaks[i].end);
    const duration = moment.duration(end.diff(start));
    const a = moment(breaksTime).add(duration.hours(), 'h').add(duration.minutes(), 'm').add(duration.seconds(), 's');
    breaksTime.set({
      hours: a.get('h'),
      minutes: a.get('m'),
      seconds: a.get('s'),
    });
  }
  return breaksTime;
};

module.exports = {
  getCurrentDate,
  checkIn,
  checkOut,
  breakStart,
  breakEnd,
  getAttendenceOfDay,
  getTotalWorkingHours,
  calculateBreaks,
  getAttendenceOfSpecificDate,
  getCurrentMonthAttendence,
  getSelectedRangeAttendence,
  presentUserCount,
  todayReport,
  updateAttendence,
  removeTimeout,
};
