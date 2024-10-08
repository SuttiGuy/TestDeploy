const isDateValid = (start_date: string | Date, end_date: string | Date): boolean =>{
    const today = new Date();

    const dateStart = new Date(start_date);
    const dateEnd = new Date(end_date);

    const timeDiffStart = dateStart.getTime() - today.getTime();
    const dayDiffStart = timeDiffStart / (1000* 3600 * 24);

    if (dayDiffStart < 0) {
        return false;
    }
    const timeDiffEnd = dateEnd.getTime() - today.getTime();
    const dayDiffEnd = timeDiffEnd /  (1000 * 3600 * 24);
    if (dayDiffEnd < 0) {
     return false   
    }
    return true

}
export default isDateValid