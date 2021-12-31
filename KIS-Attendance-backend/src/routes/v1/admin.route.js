const express = require("express");
const validate = require("../../middlewares/validate");
const { auth } = require("../../middlewares/auth");
const { adminController, leavesController } = require("../../controllers");
const { leavesValidation } = require("../../validations");

const router = express.Router();

router.route("/get-count").get(auth("getCount"), adminController.getCount);
router.route("/cancel-approved-leave/:leaveId").put(auth("cancelApprovedLeaves"), validate(leavesValidation.cancelLeave), leavesController.cancelApprovedLeave)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin Routes
 */

/**
 * @swagger
 * path:
 *  /admin/get-count:
 *    get:
 *      summary: Get Count
 *      tags: [Admin]
 *      requestBody:
 *        required: false
 *        content:
 *          application/json:
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example: {
 *                           "present": "10",
 *                           "onLeave": "1",
 *                           "total": "12",
 *                           "unChecked": "2"
 *                         }
 *        "401":
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *              example:
 *                code: 401
 *                message: Not Found
 */