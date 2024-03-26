function getTimeDifferenceInSeconds(date: Date) {
    // Get the current date and time
    const now = new Date();

    // Convert the given date to a Date object
    const givenDate = new Date(date);

    // Get the difference in milliseconds
    const differenceInMilliseconds = now.getTime() - givenDate.getTime();

    // Convert the difference to seconds and return the absolute value
    return Math.abs(differenceInMilliseconds / 1000);
}