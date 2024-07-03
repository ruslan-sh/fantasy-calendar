import { props } from "./props.js";

export function isLeapYear(yearId) {
    const { leapYear } = props.calendar;
    return (yearId - leapYear.first) % leapYear.frequency === 0;
}

function getDaysSinceYearStart(yearId, monthName) {
    const months = props.calendar.months;
    const daysSinceYearStart = months.reduce((acc, m, i) => {
        if (m.hasLeapDay && !isLeapYear(yearId)) {
            return acc;
        }
        if (i < months.findIndex((m) => m.name === monthName)) {
            return acc + m.days;
        }
        return acc;
    }, 0);
    return daysSinceYearStart;
}

export function getMonthMoonCycle(yearId, monthName) {
    function getFirstFullMoon(yearId, monthName) {
        const { daysInYear, moon } = props.astronomical;
        const { fullMoon } = props.calendar;

        // days since year started
        const daysSinceYearStart = getDaysSinceYearStart(yearId, monthName);

        // days since known full moon
        const daysSinceFullMoon =
            (yearId - fullMoon.year) * daysInYear -
            fullMoon.day +
            daysSinceYearStart;

        // days to next full moon
        let daysToNextFullMoon = 0;
        if (daysSinceFullMoon > 0) {
            daysToNextFullMoon =
                moon.period - (daysSinceFullMoon % moon.period);
        } else {
            daysToNextFullMoon = Math.abs(
                (daysSinceFullMoon % moon.period) + moon.period
            );
        }

        return daysToNextFullMoon;
    }

    const { moon } = props.astronomical;
    const { months } = props.calendar;
    const daysInMonth = months.find((m) => m.name === monthName).days;
    const moonEventLength = moon.period / 4;

    const firstFullMoon = getFirstFullMoon(yearId, monthName);
    const minusOneFullMoon = firstFullMoon - moon.period;

    let fullMoon = minusOneFullMoon;
    const moonCycle = [];
    while (fullMoon < daysInMonth) {
        moonCycle.push([
            Math.ceil(fullMoon),
            Math.ceil(fullMoon + moonEventLength),
            Math.ceil(fullMoon + moonEventLength * 2),
            Math.ceil(fullMoon + moonEventLength * 3),
        ]);
        fullMoon += moon.period;
    }
    return moonCycle;
}

function getAstronomicalEvents() {
    function getNextEvent(previousEvent, daysBetweenEvents) {
        let eventDate = previousEvent + daysBetweenEvents;
        if (eventDate > props.astronomical.daysInYear) {
            eventDate = eventDate - props.astronomical.daysInYear;
        }
        return Math.floor(eventDate);
    }

    const daysBetweenEvents = props.astronomical.daysInYear / 4;
    const springEquinox = props.calendar.springEquinox;
    const summerSolstice = getNextEvent(springEquinox, daysBetweenEvents);
    const autumnEquinox = getNextEvent(summerSolstice, daysBetweenEvents);
    const winterSolstice = getNextEvent(autumnEquinox, daysBetweenEvents);
    return { springEquinox, summerSolstice, autumnEquinox, winterSolstice };
}

export function calculateDate(currentDate, daysToAdd) {
    function getDaysInYear(yearId) {
        return isLeapYear(newYear)
            ? Math.ceil(props.astronomical.daysInYear)
            : Math.floor(props.astronomical.daysInYear);
    }
    function getMonthDays(monthName) {
        return props.calendar.months.find((m) => m.name === monthName).days;
    }

    const currentDayOfYear =
        getDaysSinceYearStart(currentDate.year, currentDate.month) +
        currentDate.day;
    let newDay = currentDayOfYear + daysToAdd;
    let newYear = currentDate.year;
    while (newDay > getDaysInYear(newYear)) {
        newDay -= getDaysInYear(newYear);
        newYear++;
    }

    const months = props.calendar.months;
    let newMonth = months[0].name;
    while (newDay > getMonthDays(newMonth)) {
        newDay -= getMonthDays(newMonth);
        newMonth =
            months[months.findIndex((m) => m.name === newMonth) + 1].name;
    }

    return { year: newYear, month: newMonth, day: newDay };
}
