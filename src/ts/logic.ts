import { props } from "./props";
import type { CalendarConfig, CalendarDate, CalendarMonth, LeapYearConfig } from "./types";

export function getMonthByNameInCalendar(
    monthName: string,
    calendar: Pick<CalendarConfig, "months">,
): CalendarMonth {
    const month = calendar.months.find((calendarMonth) => calendarMonth.name === monthName);
    if (!month) {
        throw new Error(`Month not found: ${monthName}`);
    }
    return month;
}

export function getMonthByName(monthName: string): CalendarMonth {
    return getMonthByNameInCalendar(monthName, props.calendar);
}

export function isLeapYearForCalendar(yearId: number, leapYear: LeapYearConfig): boolean {
    return (yearId - leapYear.first) % leapYear.frequency === 0;
}

export function isLeapYear(yearId: number): boolean {
    return isLeapYearForCalendar(yearId, props.calendar.leapYear);
}

export function getMonthDaysInCalendarYear(
    yearId: number,
    month: CalendarMonth,
    leapYear: LeapYearConfig,
): number {
    if (!month.leapDayMode) {
        return month.days;
    }

    if (month.leapDayMode === "leap-only") {
        return isLeapYearForCalendar(yearId, leapYear) ? month.days : 0;
    }

    return isLeapYearForCalendar(yearId, leapYear) ? month.days + 1 : month.days;
}

export function getMonthDaysInYear(yearId: number, month: CalendarMonth): number {
    return getMonthDaysInCalendarYear(yearId, month, props.calendar.leapYear);
}

export function getDaysSinceYearStartInCalendar(
    yearId: number,
    monthName: string,
    calendar: Pick<CalendarConfig, "months" | "leapYear">,
): number {
    const monthIndex = calendar.months.findIndex((month) => month.name === monthName);
    if (monthIndex < 0) {
        throw new Error(`Month not found: ${monthName}`);
    }

    return calendar.months.reduce((accumulator, month, index) => {
        if (index < monthIndex) {
            return accumulator + getMonthDaysInCalendarYear(yearId, month, calendar.leapYear);
        }

        return accumulator;
    }, 0);
}

export function getDaysSinceYearStart(yearId: number, monthName: string): number {
    return getDaysSinceYearStartInCalendar(yearId, monthName, props.calendar);
}

export function countLeapYearsBetweenInCalendar(
    startYearId: number,
    endYearId: number,
    leapYear: LeapYearConfig,
): number {
    if (startYearId === endYearId) {
        return 0;
    }

    const rangeStart = Math.min(startYearId, endYearId);
    const rangeEnd = Math.max(startYearId, endYearId);

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

export function countLeapYearsBetween(startYearId: number, endYearId: number): number {
    return countLeapYearsBetweenInCalendar(startYearId, endYearId, props.calendar.leapYear);
}

export function getDayOfYearInCalendar(
    yearId: number,
    monthName: string,
    dayId: number,
    calendar: Pick<CalendarConfig, "months" | "leapYear">,
): number {
    return getDaysSinceYearStartInCalendar(yearId, monthName, calendar) + dayId;
}

export function getDayOfYear(yearId: number, monthName: string, dayId: number): number {
    return getDayOfYearInCalendar(yearId, monthName, dayId, props.calendar);
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
