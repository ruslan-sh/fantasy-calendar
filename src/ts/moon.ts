import { props } from "./props";
import {
    countLeapYearsBetween,
    getDayOfYear,
    getDaysSinceYearStart,
    getMonthByName,
} from "./logic";
import { MoonPhaseState } from "./types";
import type { MoonCycle } from "./types";

class MoonWindow {
    public static readonly Full = 0.025;

    public static readonly New = 0.025;

    public static readonly HalfLowerWaning = 0.225;

    public static readonly HalfUpperWaning = 0.275;

    public static readonly HalfLowerWaxing = 0.725;

    public static readonly HalfUpperWaxing = 0.775;
}

export function normalizeMoonCyclePosition(cyclePos: number): number {
    if (cyclePos >= 0 && cyclePos < 1) {
        return cyclePos;
    }

    if (cyclePos === 1) {
        return 0;
    }

    return ((cyclePos % 1) + 1) % 1;
}

export function advanceMoonCyclePosition(cyclePos: number): number {
    const dailyStep = 1 / props.astronomical.moon.period;
    return normalizeMoonCyclePosition(cyclePos + dailyStep);
}

export function classifyMoonPhase(cyclePos: number): MoonPhaseState {
    const normalizedCyclePos = normalizeMoonCyclePosition(cyclePos);
    const newMoonLowerBoundary = 0.5 - MoonWindow.New;
    const newMoonUpperBoundary = 0.5 + MoonWindow.New;

    if (
        normalizedCyclePos < MoonWindow.Full ||
        normalizedCyclePos > 1 - MoonWindow.Full
    ) {
        return MoonPhaseState.Full;
    }

    if (
        normalizedCyclePos >= newMoonLowerBoundary &&
        normalizedCyclePos <= newMoonUpperBoundary
    ) {
        return MoonPhaseState.New;
    }

    if (
        normalizedCyclePos > MoonWindow.HalfLowerWaning &&
        normalizedCyclePos <= MoonWindow.HalfUpperWaning
    ) {
        return MoonPhaseState.HalfWaning;
    }

    if (
        normalizedCyclePos > MoonWindow.HalfLowerWaxing &&
        normalizedCyclePos <= MoonWindow.HalfUpperWaxing
    ) {
        return MoonPhaseState.HalfWaxing;
    }

    return MoonPhaseState.None;
}

export function getDaysOffsetFromFullMoon(
    yearId: number,
    monthName: string,
    dayId: number,
): number {
    const { fullMoon } = props.calendar;
    const baseYearDays = Math.floor(props.astronomical.daysInYear);

    return (
        getDayOfYear(yearId, monthName, dayId) -
        fullMoon.day +
        (yearId - fullMoon.year) * baseYearDays +
        countLeapYearsBetween(fullMoon.year, yearId)
    );
}

export function getMoonCyclePosition(yearId: number, monthName: string, dayId: number): number {
    const daysOffset = getDaysOffsetFromFullMoon(yearId, monthName, dayId);
    return normalizeMoonCyclePosition(daysOffset / props.astronomical.moon.period);
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
