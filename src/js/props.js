export const props = {
    astronomical: {
        daysInYear: 365.25,
        moon: {
            name: "Selûne",
            period: 30 + 10.5 / 24,
        },
    },
    calendar: {
        yearName: "DR",
        isMonthsWeeksSynced: true,
        springEquinox: 80,
        leapYear: { first: 0, frequency: 4 },
        fullMoon: { year: 1372, day: 1 },
        months: [
            { name: "Hammer", alias: "Deepwinter", days: 30 },
            { name: "Midwinter", days: 1, isFestival: true },
            { name: "Alturiak", alias: "The Claw of Winter", days: 30 },
            { name: "Ches", alias: "The Claw of Sunsets", days: 30 },
            { name: "Tarsakh", alias: "The Claw of Storms", days: 30 },
            { name: "Greengrass", days: 1, isFestival: true },
            { name: "Mirtul", alias: "The Melting", days: 30 },
            { name: "Kythorn", alias: "The Time of Flowers", days: 30 },
            { name: "Flamerule", alias: "Summertide", days: 30 },
            { name: "Midsummer", days: 1, isFestival: true },
            { name: "Shieldmeet", days: 1, isFestival: true, hasLeapDay: true },
            { name: "Eleasis", alias: "Highsun", days: 30 },
            { name: "Eleint", alias: "The Fading", days: 30 },
            { name: "Highharvestide", days: 1, isFestival: true },
            { name: "Marpenoth", alias: "Leaffall", days: 30 },
            { name: "Uktar", alias: "The Rotting", days: 30 },
            { name: "Feast of the Moon", days: 1, isFestival: true },
            { name: "Nightal", alias: "The Drawing Down", days: 30 },
        ],
        days: [
            { name: "First", short: "1st" },
            { name: "Second", short: "2st" },
            { name: "Third", short: "3rd" },
            { name: "Fourth", short: "4th" },
            { name: "Fifth", short: "5th" },
            { name: "Sixth", short: "6th" },
            { name: "Seventh", short: "7th" },
            { name: "Eighth", short: "8th" },
            { name: "Ninth", short: "9th" },
            { name: "Tenth", short: "10th" },
        ],
    },
};
