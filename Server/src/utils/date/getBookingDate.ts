const getBookingDate = (dst: string | Date, ded: string | Date): string[] => {
    const startDate = new Date(dst);
    const endDate = new Date(ded)
    let date = new Date(startDate.getTime());

    const dates:string[] =[];

        while (date <= endDate) {
            const day = date.getDate();
            const month  = date.getMonth() + 1;
            const year = date.getFullYear();
            const dateFormatted = [month , day , year].join("/");
            dates.push(dateFormatted);
            date.setDate(date.getDate()+ 1);
        }
        return dates;
}
export default getBookingDate;