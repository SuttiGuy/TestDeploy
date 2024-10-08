import express, { Request, Response } from "express";
import {
  createBook,
  confirmBooking,
  getAllBooking,
  editPackageBooking,
  editHomeStayBooking,
  cancelBooking,
  deleteBooking,
  getBookingHomeStayByUser,
  getBookingPackageByUser,
  getBookingByConfirm,
  getBookingByCheckIn,
  sendMoneyToBusiness,
  getAllBookingForAdmin,
  changeStatus
} from "../controller/booking.controller";
import { verifyToken } from "../middlewares/verifyToken";
import verifyUser from "../middlewares/verifyUser";
import verifyBusiness from "../middlewares/verifyBusiness";
import verifyAdmin from "../middlewares/verifyAdmin";
const router = express.Router();
router.get("/booking", getAllBooking, verifyAdmin, verifyToken);
router.get("/booking-check-in/:id", getBookingByCheckIn);
router.get("/booking-confirm/:id", getBookingByConfirm);
router.get(
  "/homestay-booking/:userId",
  getBookingHomeStayByUser,
  verifyUser,
  verifyToken
);
router.get(
  "/package-booking/:userId",
  getBookingPackageByUser,
  verifyUser,
  verifyToken
);
router.post("/bookingPackage", createBook, verifyUser, verifyToken);
router.put(
  "/editPackageBooking/:userId",
  editPackageBooking,
  verifyUser,
  verifyToken
);
router.put(
  "/editHomeStayBooking/:userId",
  editHomeStayBooking,
  verifyUser,
  verifyToken
);
router.put("/change-status/:id", changeStatus);
router.put("/confirmBooking/:id", confirmBooking, verifyBusiness, verifyToken);
router.put("/cancelBooking/:id", cancelBooking, verifyToken, verifyUser);
router.delete("/deleteBooking/:id", deleteBooking, verifyToken, verifyAdmin);

router.get("/getBookingForAdmin", getAllBookingForAdmin);
router.post("/sendMoney", sendMoneyToBusiness);

export default router;
