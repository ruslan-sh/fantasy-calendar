import { props } from "./props";
import type { CalendarDate, CalendarMonth } from "./types";

export function getMonthByName(monthName: string): CalendarMonth {
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

export function getMonthDaysInYear(yearId: number, month: CalendarMonth): number {
    if (!month.leapDayMode) {
        return month.days;
    }

    if (month.leapDayMode === "leap-only") {
        return isLeapYear(yearId) ? month.days : 0;
    }

    return isLeapYear(yearId) ? month.days + 1 : month.days;
}

export function getDaysSinceYearStart(yearId: number, monthName: string): number {
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

export function countLeapYearsBetween(startYearId: number, endYearId: number): number {
    if (startYearId === endYearId) {
        return 0;
    }

    const rangeStart = Math.min(startYearId, endYearId);
    const rangeEnd = Math.max(startYearId, endYearId);
    const { leapYear } = props.calendar;

    const firstLeapYearInRange =
        leapYear.first +
        Math.ceil((rangeStart - leapYear.first) / leapYear.frequency) * leapYear.frequency;

    if (firstLeapYearInRange >= rangeEnd) {
        return 0;
    }

    const leapYearsInRange =
        Math.floor((rangeEnd - 1 - firstLeapYearInRange) / leapYear.frequency) + 1;

    return startYearId < endYearId ? leapYearsInRange : -leapYearsInRange;
}

export function getDayOfYear(yearId: number, monthName: string, dayId: number): number {
    return getDaysSinceYearStart(yearId, monthName) + dayId;
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
