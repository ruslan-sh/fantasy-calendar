import { props } from "./props";
import type { CalendarDate, CalendarMonth, MoonCycle } from "./types";

function getMonthByName(monthName: string): CalendarMonth {
    const month = props.calendar.months.find((calendarMonth) => calendarMonth.name === monthName);
    if (!month) {
        throw new Error(`Month not found: ${monthName}`);
    }
    return month;
}

export function isLeapYear(yearId: number): boolean {
    const { leapYear } = props.calendar;
    return (yearId - leapYear.first) % leapYear.frequency === 0;
}

function getMonthDaysInYear(yearId: number, month: CalendarMonth): number {
    if (!month.leapDayMode) {
        return month.days;
    }

    if (month.leapDayMode === "leap-only") {
        return isLeapYear(yearId) ? month.days : 0;
    }

    return isLeapYear(yearId) ? month.days + 1 : month.days;
}

function getDaysSinceYearStart(yearId: number, monthName: string): number {
    const months = props.calendar.months;
    const monthIndex = months.findIndex((month) => month.name === monthName);
    if (monthIndex < 0) {
        throw new Error(`Month not found: ${monthName}`);
    }

    return months.reduce((accumulator, month, index) => {
        if (index < monthIndex) {
            return accumulator + getMonthDaysInYear(yearId, month);
        }

        return accumulator;
    }, 0);
}

export function getMonthMoonCycle(yearId: number, monthName: string): MoonCycle {
    function getFirstFullMoon(targetYearId: number, targetMonthName: string): number {
        const { daysInYear, moon } = props.astronomical;
        const { fullMoon } = props.calendar;

        const daysSinceYearStart = getDaysSinceYearStart(targetYearId, targetMonthName);
        const daysSinceFullMoon =
            (targetYearId - fullMoon.year) * daysInYear - fullMoon.day + daysSinceYearStart;

        if (daysSinceFullMoon > 0) {
            return moon.period - (daysSinceFullMoon % moon.period);
        }

        return Math.abs((daysSinceFullMoon % moon.period) + moon.period);
    }

    const { moon } = props.astronomical;
    const daysInMonth = getMonthByName(monthName).days;
    const moonEventLength = moon.period / 4;

    const firstFullMoon = getFirstFullMoon(yearId, monthName);
    let fullMoon = firstFullMoon - moon.period;
    const moonCycle: MoonCycle = [];

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

export function calculateDate(currentDate: CalendarDate, daysToAdd: number): CalendarDate {
    function getDaysInYear(yearId: number): number {
        return isLeapYear(yearId)
            ? Math.ceil(props.astronomical.daysInYear)
            : Math.floor(props.astronomical.daysInYear);
    }

    const currentDayOfYear =
        getDaysSinceYearStart(currentDate.year, currentDate.month) + currentDate.day;

    let newDay = currentDayOfYear + daysToAdd;
    let newYear = currentDate.year;
    while (newDay > getDaysInYear(newYear)) {
        newDay -= getDaysInYear(newYear);
        newYear += 1;
    }

    const months = props.calendar.months;
    let newMonth = months[0].name;
    let monthIndex = 0;
    while (monthIndex < months.length) {
        const month = months[monthIndex];
        if (!month) {
            throw new Error("Month not found");
        }

        const monthDays = getMonthDaysInYear(newYear, month);

        if (monthDays === 0) {
            monthIndex += 1;
            continue;
        }

        if (newDay > monthDays) {
            newDay -= monthDays;
            monthIndex += 1;
            continue;
        }

        newMonth = month.name;
        break;
    }

    return { year: newYear, month: newMonth, day: newDay };
}
