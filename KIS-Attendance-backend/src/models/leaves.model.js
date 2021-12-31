const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const leavesSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    from: {
      type: Date,
      required: true,
      trim: true,
    },
    to: {
      type: Date,
      trim: true,
    },
    leave_reason: {
      type: String,
      required: true,
      trim: true,
    },
    reject_reason: {
      type: String,
      trim: true,
    },
    start_time: {
      type: String,
      trim: true,
    },
    end_time: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Short Leave', 'Half Day', 'Full Day'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected','cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Leaves
 */
const Leaves = mongoose.model('Leaves', leavesSchema);

module.exports = Leaves;
