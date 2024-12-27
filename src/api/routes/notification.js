/**
 * @swagger
 * components:
 *   schemas:
 *     Books:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         description:
 *           type: string
 *           description: The book explanation
 *         published:
 *           type: boolean
 *           description: Whether you have finished reading the book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *     
 */
/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /book:
 *   get:
 *     summary: Lists all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Books'
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Books'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 *       500:
 *         description: Some server error
 * /book/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 *       404:
 *         description: The book was not found
 *   put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Books'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Books'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */


const { Router  } = require("express");
const { celebrate, Joi } = require("celebrate");
const UserModel = require("../../models/User")
const UserService = require("../../services/UserService");
const NotificationService = require("../../services/NotificationService");
const PaymentService = require("../../services/PaymentService");
const { sendResponse } = require("../../helper/ResponseHelper");
const { authentication, authorization } = require("../middleware");
const Secrets = require("../../config");
const router = Router();
const authRouter = Router();


// authRouter.get("/",
//   async (req, res, next) => {
//       const { user } = req.session;
//     try {
//       const userServiceInstance = new UserService(UserModel);
//       const userDetails = await userServiceInstance.getUserByEmail(user.email);
//       return sendResponse(req, res, 200, false, userDetails, "Account fetched!");
//     } catch (error) {
//       return next(error)
//     }
// });

// authRouter.put("/",
//   celebrate({
//     body: Joi.object({
//       old_password: Joi.string().required(),
//       password: Joi.string()
//       .min(8)
//       .required(),
//       confirm_password: Joi.ref("password")
//     }),
//   }),
//   async (req, res, next) => {
//     const { user } = req.session;
//     try {
//       const userServiceInstance = new UserService(UserModel);
//       const updatePassword = await userServiceInstance.updatePassword(user, req.body);
//       return sendResponse(req, res, 200, false, updatePassword, "Password updated successfully");
//     } catch (error) {
//       return next(error);
//     }
// });


// authRouter.post("/",
//   celebrate({
//     body: Joi.object({
//       title: Joi.string().required(),
//       text: Joi.string().required(),
//       action: Joi.string()
//     }),
//   }),
//   async (req, res, next) => {
//     const { user } = req.session;
//     console.log(user);
//     try {
//       const notificationServiceInstance = new NotificationService(NotificationModel);
//       const createNotification = await notificationServiceInstance.CreateNotification(req.body, user._id);
//       return sendResponse(req, res, 200, false, createNotification, "Notification Created!");
//     } catch (error) {
//       return next(error);
//     }
// });



router.use("/", authentication, authorization, authRouter);

module.exports = router;
