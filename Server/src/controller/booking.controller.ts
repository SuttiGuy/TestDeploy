import { Request, Response } from "express";
import Booking from "../model/booking.model";
import Homestay from "../model/homestay.model";
import User from "../model/user.model";
import { getBookingNights, isDateValid } from "../utils";
import BadRequestError from "../error/badrequest";
import isBookingAvailable from "../utils/date/isBookingAvailable";
import { sendEmailPayment } from "../utils/sendEmail";


const getAllBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Booking.find().populate([
      { path: "booker", select: "email name lastName" },
      { path: "homestay" },
      { path: "package" },
    ]);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(404).json({ message: "Error cannot get this booking:", error });
  }
};

const getBookingByCheckIn = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id; // รับ userId จาก params
  try {
    const bookingData = await Booking.find({
      booker: userId,
      bookingStatus: "Check-in",
    }).populate([
      { path: "booker", select: "email name lastName" },
      { path: "homestay" },
      { path: "package" },
    ]);

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (bookingData.length === 0) {
      res.status(404).json({
        message: "No bookings found for this user with CheckIn status.",
      });
    } else {
      res.status(200).json(bookingData);
    }
  } catch (error: any) {
    res.status(500).json({ message: "Error cannot get bookings", error });
  }
};

const getBookingByConfirm = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id; // รับ userId จาก params
  try {
    const bookingData = await Booking.find({booker: userId,bookingStatus: "Confirmed",}).populate([
      { path: "booker", select: "email name lastName" },
      { path: "homestay" },
      { path: "package" },
    ]);

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (bookingData.length === 0) {
      res.status(404).json({
        message: "No bookings found for this user with Confirm status.",
      });
    } else {
      res.status(200).json(bookingData);
    }
  } catch (error: any) {
    res.status(500).json({ message: "Error cannot get bookings", error });
  }
};

const getBookingHomeStayByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User Not Found!" });
      return;
    }
    const bookings = await Booking.find({ user: userId }).populate("homestay");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getBookingPackageByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User Not Found!" });
      return;
    }
    const bookings = await Booking.find({ user: userId }).populate("package");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const createBook = async (req: Request, res: Response) => {
  const { bookingData } = req.body;

  console.log("Received booking package data:", bookingData);

  try {
    const { bookingStart, bookingEnd, booker, homestayId, offer, packageId } =
      bookingData;

    if (!bookingStart || !bookingEnd || !booker) {
      return res.status(400).json({ message: "Please provide all required fields: bookingStart!" });
    }

    const night = getBookingNights(bookingStart, bookingEnd);
    if (night <= 0) {
      return res.status(400).json({ message: "Booking duration must be at least 1 night." });
    }

    const newBookingPackage = new Booking({
      booker,
      homestay: homestayId.trim() || undefined,  // ใช้ trim() เพื่อลบช่องว่างที่ไม่ต้องการ
      detail_offer: offer,
      package: packageId || undefined,
      bookingStart,
      bookingEnd,
      night,
    });

    await newBookingPackage.save();

    res.status(201).json(newBookingPackage);
  } catch (error) {
    console.error("Error while booking Package:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const editPackageBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  try {
    const data = await Booking.findByIdAndUpdate(id);
    if (!data) {
      res.status(404).json({ message: "Package Not Found" });
    }
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const editHomeStayBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  try {
    const data = await Booking.findByIdAndUpdate(id);
    if (!data) {
      res.status(404).json({ message: "HomeStay Not Found" });
    }
    res.status(201).json(data);
  } catch (error) {
    if (error instanceof Error) {
      // Handle Mongoose errors specifically
      res.status(500).json({ message: error.message });
    } else {
      // Handle other types of errors
      res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
};

const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingId = req.params.id;
  try {
    const data = await Booking.findById(bookingId);
    if (!data) {
      res.status(404).json({ message: "Booking Not Found" });
    }
    await Booking.findByIdAndDelete(bookingId);
    res.status(201).json({ message: "Booking deleted !" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingId = req.params.id;
  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { bookingStatus: "Cancelled" },
      { new: true }
    );

    if (!booking) {
      res.status(404).send({ message: "Booking not found" });
      return;
    }

    res.status(200).send(booking);
  } catch (error) {
    res.status(500).send(error);
  }
};

const confirmBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { bookingStatus: "Confirmed" },
      { new: true }
    );

    if (!booking) {
      res.status(404).send({ message: "Booking not found" });
      return;
    }

    res.status(200).send(booking);
  } catch (error) {
    res.status(500).send(error);
  }
};

const sendMoneyToBusiness = async (req: Request, res: Response): Promise<void> => {
  const { bookingId , imageUrl } = req.body;

  try {
    const bookingData = await Booking.findOne({ '_id': bookingId }).populate([
      { 
        path: "homestay",
        select: "business_user",
        populate: {
          path: "business_user"
        }
      },
      { 
        path: "package",
        select: "business_user",
        populate: {
          path: "business_user"
        }
      }
    ]);    

    if (!bookingData) {
      res.status(404).json("Can't send money. because I don't have bookingData!");
      return;
    }

    bookingData.bookingStatus = "Money-transferredBusiness";
    await bookingData.save(); 
    
    await sendEmailPayment(bookingData , imageUrl);

    res.status(200).json({
      message: 'Success send money to business'
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: 'An error occurred while processing the request',
        error: error.message, 
      });
    } else {
      res.status(500).json({
        message: 'An unknown error occurred',
        error: error,
      });
    }
  }
};

const getAllBookingForAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Booking.find().populate([
      { 
        path: "homestay",
        select: "business_user",
        populate: {
          path: "business_user"
        }
      },
      { 
        path: "package",
        select: "business_user",
        populate: {
          path: "business_user"
        }
      }
    ]);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(404).json({ message: "Error cannot get this booking:", error });
  }
};

const changeStatus = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const { bookingStatus } = req.body; // รับค่าใหม่จาก body

  try {
    if (!bookingStatus) {
      return res.status(400).json({ message: "Status is required" });
    }

    const data = await Booking.findByIdAndUpdate(
      id,
      { bookingStatus },
      { new: true, runValidators: true }
    );
    console.log(data?.bookingStatus);

    if (!data) {
      return res.status(404).json({ message: "Package Not Found" });
    }

    return res.status(200).json(data.bookingStatus);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  confirmBooking,
  createBook,
  getAllBooking,
  editPackageBooking,
  editHomeStayBooking,
  cancelBooking,
  deleteBooking,
  getBookingHomeStayByUser,
  getBookingPackageByUser,
  getBookingByCheckIn,
  getBookingByConfirm,
  sendMoneyToBusiness,
  getAllBookingForAdmin,
  changeStatus
};
