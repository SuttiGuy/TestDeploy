/**
 * @swagger
 * components:
 *  schemas:
 *    HomeStay:
 *      type: object
 *      required:
 *        - name_homeStay
 *        - room_type
 *        - max_people
 *        - detail_homeStay
 *        - time_checkIn_homeStay
 *        - time_checkOut_homeStay
 *        - policy_cancel_homeStay
 *        - location
 *        - image
 *        - business_user
 *        - review_rating_homeStay
 *        - facilities
 *        - status_sell_homeStay
 *      properties:
 *        name_homeStay:
 *          type: string
 *          description: The name of the home stay
 *        room_type:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              bathroom_homeStay:
 *                type: number
 *                description: The number of bathrooms
 *              bedroom_homeStay:
 *                type: number
 *                description: The number of bedrooms
 *              sizeBedroom_homeStay:
 *                type: string
 *                description: The size of the bedroom
 *              price_homeStay:
 *                type: number
 *                description: The price of the home stay room
 *        max_people:
 *          type: integer
 *          description: The maximum number of people for the home stay
 *        detail_homeStay:
 *          type: string
 *          description: Details of the home stay
 *        time_checkIn_homeStay:
 *          type: string
 *          format: date-time
 *          description: The check-in time of the home stay
 *        time_checkOut_homeStay:
 *          type: string
 *          format: date-time
 *          description: The check-out time of the home stay
 *        policy_cancel_homeStay:
 *          type: string
 *          description: The cancellation policy of the home stay
 *        location:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              name_location:
 *                type: string
 *                description: The name of the location
 *              province_location:
 *                type: string
 *                description: The province of the location
 *              district_location:
 *                type: string
 *                description: The district of the location
 *              subdistrict_location:
 *                type: string
 *                description: The subdistrict of the location
 *              zipcode_location:
 *                type: number
 *                description: The zipcode of the location
 *              latitude_location:
 *                type: string
 *                description: The latitude of the location
 *              longitude_location:
 *                type: string
 *                description: The longitude of the location
 *              radius_location:
 *                type: number
 *                description: The radius of the location
 *        image:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              image_upload:
 *                type: string
 *                description: The image URL of the home stay
 *        business_user:
 *          type: array
 *          items:
 *            type: string
 *            description: The ID of the business user associated with the home stay
 *        review_rating_homeStay:
 *          type: number
 *          description: The review rating of the home stay
 *        facilities:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              facilities_name:
 *                type: string
 *                description: The name of the facility
 *        status_sell_homeStay:
 *          type: boolean
 *          description: The status of the home stay (available or not)
 * tags:
 *  name: HomeStay
 *  description: The HomeStay managing API
 */

import express, { Request, Response } from "express";
import {
  getAllHomeStay,
  searchByTypeHomeStay,
  getByIdHomeStay,
  createHomeStay,
  getByPriceHomeStay,
  updateHomeStay,
  deleteHomeStay,
  searchHomeStay,
  getByIdBusiness,
  changeStatus,
} from "../controller/homestay.controller";

const router = express.Router();

/**
 * @swagger
 * /homestay:
 *   get:
 *     summary: Get all home stays.
 *     tags:    [HomeStay]
 *     responses:
 *       200:
 *         description: A list of HomeStay.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref:   '#/components/schemas/HomeStay'
 *       500:
 *         description: Some error happened
 */
router.get("/homestay", getAllHomeStay);

/**
 * @swagger
 * /homestay/type/{type_homeStay}:
 *   get:
 *     summary: Get HomeStay by type.
 *     tags:    [HomeStay]
 *     parameters:
 *      -   in: path
 *          name: type_homeStay
 *          required: true
 *          schema:
 *              type: string
 *          description: The HomeStay type
 *     responses:
 *       200:
 *          description: A list of HomeStay.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref:   '#/components/schemas/HomeStay'
 *       404:
 *          description: Not Found Type HomeStay
 *       500:
 *          description: Some error happened!!
 */
router.get("/homestay/type/:type_homeStay", searchByTypeHomeStay);

router.get("/business-homestay/:id", getByIdBusiness);

/**
 * @swagger
 * /homestay/{id}:
 *   get:
 *     summary: Get HomeStay by ID.
 *     tags:    [HomeStay]
 *     parameters:
 *      -   in: path
 *          name: id
 *          required: true
 *          schema:
 *              type: string
 *          description: The HomeStay ID
 *     responses:
 *       200:
 *          description: A HomeStay object.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref:   '#/components/schemas/HomeStay'
 *       404:
 *          description: Not Found HomeStay ID
 *       500:
 *          description: Some error happened!!
 */
router.get("/homestay/:id", getByIdHomeStay);

/**
 * @swagger
 * /homestay/price/{price}:
 *   get:
 *     summary: Get HomeStay by price.
 *     tags:    [HomeStay]
 *     parameters:
 *      -   in: path
 *          name: price
 *          required: true
 *          schema:
 *              type: number
 *          description: The HomeStay price
 *     responses:
 *       200:
 *          description: A list of HomeStay.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref:   '#/components/schemas/HomeStay'
 *       404:
 *          description: Not Found HomeStay price
 *       500:
 *          description: Some error happened!!
 */
router.get("/homestay/price/:price", getByPriceHomeStay);

/**
 * @swagger
 * /homestay:
 *   post:
 *     summary: Create a new HomeStay.
 *     tags:    [HomeStay]
 *     requestBody:
 *          required:   true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref:   '#/components/schemas/HomeStay'
 *     responses:
 *          201:
 *              description: The HomeStay is created.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref:   '#/components/schemas/HomeStay'
 *          500:
 *              description: Some error happened
 */
router.post("/homestay", createHomeStay);

router.post("/changeStatus/:id", changeStatus);

/**
 * @swagger
 * /homestay/{id}:
 *   put:
 *     summary: Update the home stay details.
 *     tags:    [HomeStay]
 *     parameters:
 *      -   in: path
 *          name: id
 *          required: true
 *          schema:
 *              type: string
 *          description: The HomeStay ID
 *     requestBody:
 *      required:   true
 *      content:
 *          application/json:
 *              schema:
 *                  $ref:   '#/components/schemas/HomeStay'
 *     responses:
 *      200:
 *          description: The HomeStay is updated.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref:   '#/components/schemas/HomeStay'
 *      404:
 *          description: HomeStay Not Found
 *      500:
 *          description: Some error happened
 */
router.put("/homestay/:id", updateHomeStay);

/**
 * @swagger
 * /homestay/{id}:
 *   delete:
 *     summary: Delete home stay by ID.
 *     tags:    [HomeStay]
 *     parameters:
 *      -   in: path
 *          name: id
 *          required: true
 *          schema:
 *              type: string
 *          description: The HomeStay ID
 *     responses:
 *      200:
 *          description: HomeStay is deleted.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref:   '#/components/schemas/HomeStay'
 *      404:
 *          description: Not Found HomeStay
 *      500:
 *          description: Some error happened
 */
router.delete("/homestay/:id", deleteHomeStay);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search HomeStay.
 *     tags: [HomeStay]
 *     parameters:
 *       - in: query
 *         name: name_homeStay
 *         schema:
 *           type: string
 *         description: Search by name.
 *       - in: query
 *         name: room_type
 *         schema:
 *           type: string
 *         description: Search by room type.
 *       - in: query
 *         name: detail_homeStay
 *         schema:
 *           type: string
 *         description: Search by detail.
 *     responses:
 *       200:
 *         description: A list of HomeStay.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HomeStay'
 *       500:
 *         description: Some error happened!!
 */
router.get("/search", searchHomeStay);

export default router;
