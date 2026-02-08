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

function getDaysSinceYearStart(yearId: number, monthName: string): number {
    const months = props.calendar.months;
    const monthIndex = months.findIndex((month) => month.name === monthName);
    if (monthIndex < 0) {
        throw new Error(`Month not found: ${monthName}`);
    }

    return months.reduce((accumulator, month, index) => {
        if (month.hasLeapDay && !isLeapYear(yearId)) {
            return accumulator;
        }

        if (index < monthIndex) {
            return accumulator + month.days;
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

    let newMonth = props.calendar.months[0].name;
    while (newDay > getMonthByName(newMonth).days) {
        newDay -= getMonthByName(newMonth).days;
        const monthIndex = props.calendar.months.findIndex((month) => month.name === newMonth);
        const nextMonth = props.calendar.months[monthIndex + 1];
        if (!nextMonth) {
            throw new Error("Next month not found");
        }
        newMonth = nextMonth.name;
    }

    return { year: newYear, month: newMonth, day: newDay };
}
