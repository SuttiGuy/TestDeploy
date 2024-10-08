/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - reviewer
 *         - content
 *         - rating
 *         - package
 *         - homestay
 *       properties:
 *         reviewer:
 *           type: string
 *           description: The ID of the reviewer
 *         content:
 *           type: string
 *           description: The content of the review
 *         rating:
 *           type: number
 *           description: The rating of the review
 *         package:
 *           type: string
 *           description: The ID of the associated package
 *         homestay:
 *           type: string
 *           description: The ID of the associated homestay
 *       example:
 *         reviewer: "user123"
 *         content: "Great stay, very comfortable!"
 *         rating: 4.5
 *         package: "package456"
 *         homestay: "homestay789"
 * 
 *     Content:
 *       type: object
 *       required:
 *         - title
 *         - body
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the content
 *         body:
 *           type: string
 *           description: The body of the content
 *       example:
 *         title: "Amazing Experience"
 *         body: "This was one of the best trips we've ever had!"
 * 
 * tags:
 *   - name: Review
 *     description: API for managing reviews
 *   - name: Content
 *     description: API for managing content
 *   - name: Rating
 *     description: API for managing ratings
 */

import express, { Request, Response } from "express";
import {
  createContent,
  createReview,
  deleteReview,
  getAllReview,
  getRating,
  setRating,
  updateReview,
  updateContent,
  getReviewByHomeStay,
  getReviewByPackageId,
} from "../controller/review.controller";

const router = express.Router();

/**
 * @swagger
 * /review:
 *   get:
 *     summary: Get all reviews
 *     tags: [Review]
 *     responses:
 *       200:
 *         description: Successfully retrieved all reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get("/review", getAllReview);

/**
 * @swagger
 * /createReview:
 *   post:
 *     summary: Create a new review
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Successfully created a review.
 */
router.post("/createReview", createReview);

/**
 * @swagger
 * /updateReview/{id}:
 *   put:
 *     summary: Update a review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successfully updated the review.
 */
router.put("/updateReview/:id", updateReview);

/**
 * @swagger
 * /deleteReview/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the review.
 */
router.delete("/deleteReview/:id", deleteReview);

/**
 * @swagger
 * /createContent:
 *   post:
 *     summary: Create new content
 *     tags: [Content]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Content'
 *     responses:
 *       201:
 *         description: Successfully created content.
 */
router.post("/createContent", createContent);

/**
 * @swagger
 * /updateContent:
 *   put:
 *     summary: Update existing content
 *     tags: [Content]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Content'
 *     responses:
 *       200:
 *         description: Successfully updated the content.
 */
router.put("/updateContent", updateContent);

/**
 * @swagger
 * /getRating:
 *   get:
 *     summary: Get rating details
 *     tags: [Rating]
 *     responses:
 *       200:
 *         description: Successfully retrieved rating details.
 */
router.get("/getRating", getRating);

/**
 * @swagger
 * /setRating:
 *   put:
 *     summary: Set a rating
 *     tags: [Rating]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successfully set the rating.
 */
router.put("/setRating", setRating);

/**
 * @swagger
 * /getReviewByHomeStay/{homeStayId}:
 *   get:
 *     summary: Get reviews by homestay ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: homeStayId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the homestay to retrieve reviews for
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews for the homestay.
 */
router.get("/getReviewByHomeStay/:homeStayId", getReviewByHomeStay);

/**
 * @swagger
 * /getReviewByPackage/{packageId}:
 *   get:
 *     summary: Get reviews by package ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the package to retrieve reviews for
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews for the package.
 */
router.get("/getReviewByPackage/:packageId", getReviewByPackageId);

export default router;
