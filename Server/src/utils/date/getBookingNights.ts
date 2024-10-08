// src/utils/date/getBookingNights.ts
const getBookingNights = (start_date: string | Date, end_date: string | Date): number => {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date provided");
    }

    const differenceInTime = endDate.getTime() - startDate.getTime();
    if (differenceInTime < 0) {
        return 0; // หรือจัดการกรณีที่วันที่สิ้นสุดก่อนวันที่เริ่ม
    }
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
};

export default getBookingNights;
