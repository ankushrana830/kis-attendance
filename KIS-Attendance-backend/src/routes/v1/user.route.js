const express = require('express');
const validate = require('../../middlewares/validate');

const { auth } = require('../../middlewares/auth'); 
const { userController } = require('../../controllers');
const { userValidation } = require('../../validations');

const router = express.Router();
router.route('/add').post(auth('addEmployee'), validate(userValidation.addEmployee), userController.addEmployee);
router.route('/get/:userId').get(auth('getEmployee'),userController.getUser);
router.route('/get-current-user').get(auth('getEmployee'),userController.getUserByToken);
router.route('/get-all-bday').get(auth('getAllBday'),userController.getAllBday);
router.route('/update').put(auth('editEmployee'),userController.updateUser);
router.route('/update-user/:userId').put(userController.updateSingleUser);
router.route('/image-upload').put(auth('uploadImage'), validate(userValidation.uploadImage),userController.uploadImage);
router.route('/get-unchecked-users').get(auth('getUnCheckedUsers'), userController.getUnCheckedEmployees);
router.route('/get-all').get(auth('getAllEmployees'), userController.getAllEmployees);
router.route('/user-count').get(auth('getUsersCount'), userController.getUsersCount);
router.route('/delete').delete(auth('deleteEmployee'), userController.deleteEmployee);
router.route('/deactivate-employee').post(auth('deactivateEmployee'), userController.deactivateEmployee);
router.route('/get-deactivated-employees').get(auth('getDeactivatedEmployees'), userController.getDeactivatedEmployees);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User data
 */

/**
 * @swagger
 * path:
 *  /user/add:
 *    post:
 *      summary: Add User
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - name
 *                - emp_id
 *                - phone
 *                - doj
 *                - designation
 *                - status
 *                - role
 *                - password
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                name:
 *                  type: string
 *                emp_id:
 *                  type: number
 *                phone:
 *                  type: string
 *                doj:
 *                  type: date
 *                designation:
 *                  type: string
 *                status:
 *                  type: boolean
 *                role:
 *                  type: string
 *                password:
 *                  type: string
 *                  format: password
 *              example:
 *                email: fake@example.com
 *                name: fake@example
 *                emp_id: 123456
 *                phone: 09876543210
 *                doj: 2021-07-08
 *                designation: fake
 *                role: dev
 *                status: false
 *                password: password1
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *                  tokens:
 *                    $ref: '#/components/schemas/AuthTokens'
 *        "401":
 *          description: Invalid email or password
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *              example:
 *                code: 401
 *                message: Invalid email or password
 */

/**
 * @swagger
 * path:
 *  /user/get-all:
 *    get:
 *      summary: Get User
 *      tags: [User]
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
 *                properties:
 *                  user:
 *                    $ref: '#/components/schemas/User'
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

/**
 * @swagger
 * path:
 *  /user/delete:
 *    delete:
 *      summary: Delete User
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - userId
 *              properties:
 *                userId:
 *                  type: string
 *              example:
 *                userId: [60e43f2f90254a06ecc32ca]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              example:
 *                code: 200
 *                message: Deleted Successfully.
 *        "401":
 *          description: User not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *              example:
 *                code: 401
 *                message: Not Found
 */
