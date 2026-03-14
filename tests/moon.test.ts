import test from "node:test";
import assert from "node:assert/strict";

import { props } from "../src/ts/props";
import {
    advanceMoonCyclePosition,
    classifyMoonPhase,
    getDaysOffsetFromFullMoon,
    getMoonCyclePosition,
    normalizeMoonCyclePosition,
} from "../src/ts/moon";
import { getDayOfYear, getMonthByName, getMonthDaysInYear, isLeapYear } from "../src/ts/logic";
import { MoonPhaseState } from "../src/ts/types";

function assertClose(actual: number, expected: number, message?: string): void {
    assert.ok(
        Math.abs(actual - expected) <= 1e-12,
        message ?? `Expected ${actual} to be within tolerance of ${expected}`,
    );
}

function naiveDaysOffsetFromAnchor(yearId: number, monthName: string, dayId: number): number {
    const baseYearDays = Math.floor(props.astronomical.daysInYear);
    const anchorYear = props.calendar.fullMoon.year;
    let daysOffset = getDayOfYear(yearId, monthName, dayId) - props.calendar.fullMoon.day;

    if (yearId >= anchorYear) {
        for (let currentYear = anchorYear; currentYear < yearId; currentYear += 1) {
            daysOffset += baseYearDays + (isLeapYear(currentYear) ? 1 : 0);
        }

        return daysOffset;
    }

    for (let currentYear = yearId; currentYear < anchorYear; currentYear += 1) {
        daysOffset -= baseYearDays + (isLeapYear(currentYear) ? 1 : 0);
    }

    return daysOffset;
}

function getAnchorFullMoonDate(): { monthName: string; dayId: number } {
    let remainingDayOfYear = props.calendar.fullMoon.day;

    for (const month of props.calendar.months) {
        const daysInMonth = getMonthDaysInYear(props.calendar.fullMoon.year, month);

        if (remainingDayOfYear <= daysInMonth) {
            return { monthName: month.name, dayId: remainingDayOfYear };
        }

        remainingDayOfYear -= daysInMonth;
    }

    throw new Error("Configured full moon day is outside the target year");
}

test("normalizeMoonCyclePosition wraps values into [0, 1)", () => {
    assert.equal(normalizeMoonCyclePosition(0), 0);
    assert.equal(normalizeMoonCyclePosition(1), 0);
    assert.equal(normalizeMoonCyclePosition(-1), 0);
    assert.equal(normalizeMoonCyclePosition(1.25), 0.25);
    assert.equal(normalizeMoonCyclePosition(-0.25), 0.75);
});

test("advanceMoonCyclePosition moves one day forward and wraps", () => {
    const dailyStep = 1 / props.astronomical.moon.period;

    assertClose(advanceMoonCyclePosition(0), dailyStep);
    assertClose(
        advanceMoonCyclePosition(1 - dailyStep / 2),
        normalizeMoonCyclePosition(1 - dailyStep / 2 + dailyStep),
    );
});

test("classifyMoonPhase matches spec boundary semantics", () => {
    assert.equal(classifyMoonPhase(0), MoonPhaseState.Full);
    assert.equal(classifyMoonPhase(0.024999), MoonPhaseState.Full);
    assert.equal(classifyMoonPhase(0.025), MoonPhaseState.None);
    assert.equal(classifyMoonPhase(0.975), MoonPhaseState.None);
    assert.equal(classifyMoonPhase(0.975001), MoonPhaseState.Full);

    assert.equal(classifyMoonPhase(0.475), MoonPhaseState.New);
    assert.equal(classifyMoonPhase(0.5), MoonPhaseState.New);
    assert.equal(classifyMoonPhase(0.525), MoonPhaseState.New);
    assert.equal(classifyMoonPhase(0.474999), MoonPhaseState.None);
    assert.equal(classifyMoonPhase(0.525001), MoonPhaseState.None);

    assert.equal(classifyMoonPhase(0.225), MoonPhaseState.None);
    assert.equal(classifyMoonPhase(0.225001), MoonPhaseState.HalfWaning);
    assert.equal(classifyMoonPhase(0.275), MoonPhaseState.HalfWaning);
    assert.equal(classifyMoonPhase(0.275001), MoonPhaseState.None);

    assert.equal(classifyMoonPhase(0.725), MoonPhaseState.None);
    assert.equal(classifyMoonPhase(0.725001), MoonPhaseState.HalfWaxing);
    assert.equal(classifyMoonPhase(0.775), MoonPhaseState.HalfWaxing);
    assert.equal(classifyMoonPhase(0.775001), MoonPhaseState.None);
});

test("getDaysOffsetFromFullMoon returns zero at the configured anchor full moon", () => {
    const anchorFullMoonDate = getAnchorFullMoonDate();

    assert.equal(
        getDaysOffsetFromFullMoon(
            props.calendar.fullMoon.year,
            anchorFullMoonDate.monthName,
            anchorFullMoonDate.dayId,
        ),
        0,
    );
});

test("getDaysOffsetFromFullMoon accounts for leap and non-leap year lengths in both directions", () => {
    assert.equal(getDaysOffsetFromFullMoon(1373, "Hammer", 1), 366);
    assert.equal(getDaysOffsetFromFullMoon(1376, "Hammer", 1), 1461);
    assert.equal(getDaysOffsetFromFullMoon(1376, "Shieldmeet", 1), 1674);
    assert.equal(getDaysOffsetFromFullMoon(1371, "Hammer", 1), -365);
});

test("getMoonCyclePosition initializes directly from the anchor for past and future dates", () => {
    const referenceDates: Array<[number, string, number]> = [
        [1372, "Hammer", 1],
        [1373, "Hammer", 1],
        [1376, "Shieldmeet", 1],
        [1300, "Greengrass", 1],
        [1450, "Feast of the Moon", 1],
    ];

    for (const [yearId, monthName, dayId] of referenceDates) {
        const expectedCyclePosition = normalizeMoonCyclePosition(
            naiveDaysOffsetFromAnchor(yearId, monthName, dayId) / props.astronomical.moon.period,
        );

        assertClose(
            getMoonCyclePosition(yearId, monthName, dayId),
            expectedCyclePosition,
            `${yearId} ${monthName} ${dayId}`,
        );
    }
});

test("getMoonCyclePosition advances continuously across month and leap-day boundaries", () => {
    const flameruleLastDay = getMoonCyclePosition(1376, "Flamerule", 30);
    const midsummer = getMoonCyclePosition(1376, "Midsummer", 1);
    const shieldmeet = getMoonCyclePosition(1376, "Shieldmeet", 1);
    const eleasis = getMoonCyclePosition(1376, "Eleasis", 1);

    assertClose(midsummer, advanceMoonCyclePosition(flameruleLastDay));
    assertClose(shieldmeet, advanceMoonCyclePosition(midsummer));
    assertClose(eleasis, advanceMoonCyclePosition(shieldmeet));
});

test("festival and normal months use the same day-start moon logic", () => {
    const greengrassCyclePosition = getMoonCyclePosition(1372, "Greengrass", 1);
    const dayBeforeFestival = getMoonCyclePosition(1372, "Tarsakh", getMonthByName("Tarsakh").days);
    const dayAfterFestival = getMoonCyclePosition(1372, "Mirtul", 1);

    assertClose(greengrassCyclePosition, advanceMoonCyclePosition(dayBeforeFestival));
    assertClose(dayAfterFestival, advanceMoonCyclePosition(greengrassCyclePosition));
});
