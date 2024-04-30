const { setTimeout } = require('timers');

// Input duration in hours
const durationInHours = 0.2;

// Convert duration to milliseconds
const durationInMilliseconds = durationInHours * 60 * 60 * 1000;

// Input date string
const inputDate = new Date().getTime();

// Parse input date to get the end time
const endTime = new Date(inputDate).getTime() + durationInMilliseconds;

// Calculate time remaining in seconds
const currentTime = new Date().getTime();
const timeRemainingInSeconds = Math.max(Math.floor((endTime - currentTime) / 1000), 0);

console.log(timeRemainingInSeconds);

// Alternatively, you can use setTimeout to execute a function after the specified duration
const remainingTimeHandler = () => {
    const remainingTimeInSeconds = Math.max(Math.floor((endTime - new Date().getTime()) / 1000), 0);
    console.log(remainingTimeInSeconds);
};

// Use setTimeout to call remainingTimeHandler after the specified duration
setTimeout(remainingTimeHandler, durationInMilliseconds);

console.log(currentTime.toLocaleString());
