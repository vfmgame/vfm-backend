function getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}

function checkCurrentDate(start, end) {
    const currentDate = new Date(start);
    const checkedInDate = new Date(end);

    let result;

    if (currentDate > checkedInDate) {
        result = true;
    } else {
        result = false;
    }

    return result;
}

module.exports = {
    getNumberOfDays,
    checkCurrentDate
};