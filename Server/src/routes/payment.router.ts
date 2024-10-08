import express, { Request, Response } from "express";
const router = express.Router();
import {payment, checkBooking} from "../controller/payment.controller";

// router.post("/generateQR", generateQR)
router.post("/create-checkout-session", payment)
router.post('/checkBooking', checkBooking);

export default router;