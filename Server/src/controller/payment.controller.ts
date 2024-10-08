import express, { Request, Response } from "express";
import QRCode from "qrcode";
import generatePayload from "promptpay-qr";
import _ from "lodash";
import Stripe from "stripe";
import BookingModel from "../model/booking.model";
import { getBookingNights, isDateValid } from "../utils";
import BadRequestError from "../error/badrequest";
import isBookingAvailable from "../utils/date/isBookingAvailable";

const YOUR_DOMAIN = "http://localhost:5173";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const checkBooking = async (req: Request, res: Response) => {
  const { homestay, bookingStart, bookingEnd, booker, packageId } = req.body;
  console.log(req.body);
  
  const bookingStartDate = new Date(bookingStart);
  const bookingEndDate = new Date(bookingEnd);
  try {
    const data = {
      booker,
      homestay,
      package: packageId,
      bookingStart: bookingStartDate,
      bookingEnd: bookingEndDate,
    };
    const isAvailable = await BookingModel.findOne(data);
    if (!isAvailable) {
      return res.status(200).json({
        isAvailable,
        message: "ยังไม่เคยจอง",
      });
    } else {
      return res.status(200).json({
        isAvailable,
        message: "คุณต้องการทำการจองซ้ำอีกครั้งหรือไม่?",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const payment = async (req: Request, res: Response) => {
  const { totalPrice, name, email } = req.body;
  console.log(req.body);
  const price = parseInt((totalPrice * 100).toFixed(0));

  try {
    // สร้าง session ของ Stripe
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: name,
            },
            unit_amount: price, // ราคาเป็นจำนวนเต็มในหน่วยย่อย (เช่น สตางค์)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/paymentSuccess`,
      cancel_url: `${YOUR_DOMAIN}/paymentFailure`,
      customer_email: email,
    });

    res.status(201).json({
      sessionUrl: session.url,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


export { payment, checkBooking };
