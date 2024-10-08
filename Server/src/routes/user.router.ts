/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - houseNumber
 *         - village
 *         - district
 *         - street
 *         - city
 *         - country
 *         - postalCode
 *       properties:
 *         houseNumber:
 *           type: string
 *           description: The house number
 *         village:
 *           type: string
 *           description: The village name
 *         district:
 *           type: string
 *           description: The district name
 *         street:
 *           type: string
 *           description: The street name
 *         city:
 *           type: string
 *           description: The city name
 *         country:
 *           type: string
 *           description: The country name
 *         postalCode:
 *           type: string
 *           description: The postal code
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - lastName
 *         - phone
 *         - addresses
 *         - isVerified
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         name:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         birthday:
 *           type: string
 *           format: date
 *           description: The user's birthday
 *         phone:
 *           type: string
 *           description: The user's phone number
 *         image:
 *           type: string
 *           description: The user's profile image URL
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         isVerified:
 *           type: boolean
 *           description: The user's verification status
 *         role:
 *           type: string
 *           description: The user's role
 *     Business:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - businessName
 *         - name
 *         - lastName
 *         - phone
 *         - addresses
 *         - idcard
 *         - BankingName
 *         - BankingUsername
 *         - BankingUserlastname
 *         - BankingCode
 *         - isVerified
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           description: The business's email
 *         password:
 *           type: string
 *           description: The business's password
 *         businessName:
 *           type: string
 *           description: The business's name
 *         name:
 *           type: string
 *           description: The business owner's first name
 *         lastName:
 *           type: string
 *           description: The business owner's last name
 *         birthday:
 *           type: string
 *           format: date
 *           description: The business owner's birthday
 *         phone:
 *           type: string
 *           description: The business's phone number
 *         image:
 *           type: string
 *           description: The business's profile image URL
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         idcard:
 *           type: string
 *           description: The business owner's ID card number
 *         BankingName:
 *           type: string
 *           description: The name of the bank
 *         BankingUsername:
 *           type: string
 *           description: The bank account owner's first name
 *         BankingUserlastname:
 *           type: string
 *           description: The bank account owner's last name
 *         BankingCode:
 *           type: string
 *           description: The bank account number
 *         isVerified:
 *           type: boolean
 *           description: The business's verification status
 *         role:
 *           type: string
 *           description: The business's role
 *     Admin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - lastName
 *         - phone
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           description: The admin's email
 *         password:
 *           type: string
 *           description: The admin's password
 *         name:
 *           type: string
 *           description: The admin's first name
 *         lastName:
 *           type: string
 *           description: The admin's last name
 *         birthday:
 *           type: string
 *           format: date
 *           description: The admin's birthday
 *         phone:
 *           type: string
 *           description: The admin's phone number
 *         image:
 *           type: string
 *           description: The admin's profile image URL
 *         role:
 *           type: string
 *           description: The admin's role
 *       example:
 *         email: "admin@example.com"
 *         password: "securepassword123"
 *         name: "Admin"
 *         lastName: "User"
 *         birthday: "1980-01-01T00:00:00.000Z"
 *         phone: "098765432109"
 *         image: "https://example.com/admin-image.jpg"
 *         role: "admin"
 */

import { Request, Response, Router } from "express";
import {
  userRegister,
  businessRegister,
  adminRegister,
  Login,
  Logout,
  getAllUser,
  getAllBusiness,
  getAllAdmin,
  updateUser,
  checkEmailExists,
  getUserById,
  updateUserAddress,
  ChangePassword,
  getBusinessById
} from "../controller/user.controller";
import verifyEmailToken from "../middlewares/verifyEmailToken";
import { verifyToken } from "../middlewares/verifyToken";
import verifyUser from "../middlewares/verifyUser";
import verifyAdmin from "../middlewares/verifyAdmin";
import verifyBusiness from "../middlewares/verifyBusiness";

const router = Router();

/**
 * @swagger
 * /user/userData:
 *   get:
 *     summary: Get all user data
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user does not have admin privileges
 */
router.get("/userData", getAllUser);

router.get("/userData/:id", getUserById);

router.get("/businessData/:id", getBusinessById);

/**
 * @swagger
 * /user/businessData:
 *   get:
 *     summary: Get all businesses
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all businesses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Business'
 *       500:
 *         description: Internal server error
 */
router.get("/businessData", getAllBusiness);

/**
 * @swagger
 * /user/adminData:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 *       500:
 *         description: Internal server error
 */
router.get("/adminData", getAllAdmin);

/**
 * @swagger
 * /user/userRegister:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             email: "user@gmail.com"
 *             password: "user123456"
 *             name: "John"
 *             lastName: "Doe"
 *             birthday: "1990-01-01"
 *             phone: "+66928983405"
 *             image: "https://example.com/profile-image.jpg"
 *             addresses:
 *               - houseNumber: "123"
 *                 village: "Village"
 *                 district: "District"
 *                 street: "Street"
 *                 city: "City"
 *                 country: "Country"
 *                 postalCode: "12345"
 *             isVerified: false
 *             role: "user"
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       400:
 *         description: Bad request
 *       302:
 *         description: Email is already in use
 */
router.post("/userRegister", userRegister);

/**
 * @swagger
 * /user/businessRegister:
 *   post:
 *     summary: Register a new business
 *     tags: [Business]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Business'
 *     responses:
 *       201:
 *         description: The business was successfully created
 *       400:
 *         description: Bad request
 *       302:
 *         description: Email is already in use
 */
router.post("/businessRegister", businessRegister);

/**
 * @swagger
 * /user/adminRegister:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       201:
 *         description: The admin was successfully created
 *       400:
 *         description: Bad request
 */
router.post("/adminRegister", verifyToken, verifyAdmin, adminRegister);

/**
 * @swagger
 * /user/checkEmailExists:
 *   post:
 *     summary: Check if email exists
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email to check
 *               role:
 *                 type: string
 *                 description: Role of the user (user, business, admin)
 *     responses:
 *       200:
 *         description: True if email exists, false otherwise
 *       500:
 *         description: Internal server error
 */
router.post("/checkEmailExists", checkEmailExists);


/**
 * @swagger
 * /user/updateUser/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid role specified
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/updateUser/:id", updateUser);

router.put("/updateAddress/:id", updateUserAddress);

router.put("/update-password", ChangePassword);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Wrong credentials
 */
router.post("/login", Login);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post("/logout", Logout);

/**
 * @swagger
 * /user/verify:
 *   get:
 *     summary: Verify email token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get("/verify", verifyEmailToken);

export default router;
