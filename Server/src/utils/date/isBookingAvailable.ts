import Booking from "../../model/booking.model";
import { startOfDay , endOfDay } from "date-fns";
import getBookingDate from "./getBookingDate";
const isBookingAvailable = async (homestayId: string, startDate: Date, endDate: Date): Promise<boolean> => {
    try {
      const datesToCheck = getBookingDate(startDate, endDate);

      const bookings = await Booking.find({
        homestay: homestayId,
        $or: [
          { start_date: { $lt: endOfDay(startDate) }, end_date: { $gte: startDate } },
          { start_date: { $lte: endDate }, end_date: { $gt: startOfDay(endDate) } }
        ]
      });
      const isAvailable = bookings.every((booking) => {
        const bookingDates = getBookingDate(booking.bookingStart, booking.bookingEnd);
        return !datesToCheck.some(date => bookingDates.includes(date));
      });
  
      return isAvailable;
    } catch (error) {
      console.error('Error checking booking availability:', error);
      throw new Error('Error checking booking availability');
    }
  };
  
  export default isBookingAvailable;