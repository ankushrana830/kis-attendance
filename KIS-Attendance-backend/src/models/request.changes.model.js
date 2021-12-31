const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const changeRequestSchema = mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendence_id: {
      type: String,
    },
    date: {
      type: Date,
      trim: true,
    },
    request_message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Leave Request", "Change Request"],
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
// tokenSchema.plugin(toJSON);

// changeRequestSchema.plugin(toJSON);
// changeRequestSchema.plugin(paginate);

/**
 * @typedef ChangeRequests
 */
const ChangeRequests = mongoose.model("Change_Requests", changeRequestSchema);

module.exports = ChangeRequests;
