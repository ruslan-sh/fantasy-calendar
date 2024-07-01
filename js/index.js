const props = {
    astronomical: {
        daysInYear: 365.25,
        moon: {
            name: "Selûne",
            period: 30 + 10.5/24
        }
    },
    calendar: {
        isMonthsWeeksSynced: true,
        springEquinox: 80,
        leapYear: {first: 0, frequency: 4},
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
            { name: "Eleint", alias:"The Fading", days: 30 },
            { name: "Highharvestide", days: 1, isFestival: true },
            { name: "Marpenoth", alias:"Leaffall", days: 30 },
            { name: "Uktar", alias:"The Rotting", days: 30 },
            { name: "Feast of the Moon", days: 1, isFestival: true },
            { name: "Nightal", alias:"The Drawing Down", days: 30 }
        ],
        days: [
            "First",
            "Second",
            "Third",
            "Fourth",
            "Fifth",
            "Sixth",
            "Seventh",
            "Eighth",
            "Ninth",
            "Tenth",
        ],
    }
};

function isLeapYear(yearId) {
    const {leapYear} = props.calendar;
    return (yearId - leapYear.first) % leapYear.frequency === 0;
}

function getDaysSinceYearStart(yearId, monthName) {
    const months = props.calendar.months;
    const daysSinceYearStart = months.reduce((acc, m, i) => {
        if (m.hasLeapDay && !isLeapYear(yearId)) {
            return acc;
        }
        if (i < months.findIndex(m => m.name === monthName)) {
            return acc + m.days;
        }
        return acc;
    }, 0);
    return daysSinceYearStart;
}

function getMonthFullMoonDay(yearId, monthName) {
    const {daysInYear, moon} = props.astronomical;
    const {fullMoon, months} = props.calendar;

    // days since year started
    const daysSinceYearStart = getDaysSinceYearStart(yearId, monthName);

    // days since known full moon
    const daysSinceFullMoon = (yearId - fullMoon.year) * daysInYear - fullMoon.day + daysSinceYearStart;

    // days to next full moon
    let daysToNextFullMoon = 0;
    if (daysSinceFullMoon > 0) {
        daysToNextFullMoon = moon.period - (daysSinceFullMoon % moon.period);
    } else {
        daysToNextFullMoon = Math.abs(daysSinceFullMoon % moon.period);
    }

    const result = Math.ceil(daysToNextFullMoon);
    return result;
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
    return {springEquinox, summerSolstice, autumnEquinox, winterSolstice};
}

function calculateDate(currentDate, daysToAdd) {
    function getDaysInYear(yearId) {
        return isLeapYear(newYear) 
           ? Math.ceil(props.astronomical.daysInYear) 
            : Math.floor(props.astronomical.daysInYear);
    }
    function getMonthDays(monthName) {
        return props.calendar.months.find(m => m.name === monthName).days;
    }

    const currentDayOfYear = getDaysSinceYearStart(currentDate.year, currentDate.month) + currentDate.day;
    let newDay = currentDayOfYear + daysToAdd;
    let newYear = currentDate.year;
    while (newDay > getDaysInYear(newYear)) {
        newDay -= getDaysInYear(newYear);
        newYear++;
    }

    const months = props.calendar.months;
    let newMonth = currentDate.month;
    while (newDay > getMonthDays(newMonth)) {
        newDay -= getMonthDays(newMonth);
        newMonth = months[months.findIndex(m => m.name === newMonth) + 1].name;
    }

    return {year: newYear, month: newMonth, day: newDay};
}


function renderMonth(yearId, monthName, currentDay) {
    function calculateFirstDay(yearId, monthName) {
        return 0; // Assuming the first day of every month is the first day of the week
    }

    function renderWeek(tbody, dayIndex, firstDay, weekLength, monthDays, fullMoonDay) {
        const tr = document.createElement('tr');
        for (let i = 0; i < weekLength; i++) {
            const td = document.createElement('td');
            if (dayIndex === 0) {
                if (i < firstDay) {
                    td.textContent = '';
                    tr.appendChild(td);
                    continue;
                }
            }
            
            if (dayIndex >= monthDays) {
                td.textContent = '';
                tr.appendChild(td);
                continue;
            }

            td.textContent = ++dayIndex;
            if (dayIndex === fullMoonDay) {
                td.classList.add('full-moon');
            }
            if (dayIndex === currentDay) {
                td.classList.add('current-day');
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
        return dayIndex;
    }

    const month = props.calendar.months.find(m => m.name === monthName);
    if (!month) {
        console.error('Month not found');
        return;
    }

    // Assuming a function to calculate the full moon day (returns a day number)
    const fullMoonDay = getMonthFullMoonDay(yearId, monthName);

    const container = document.createElement('div');
    const monthHeader = document.createElement("h2");
    monthHeader.textContent = `${month.name} (${month.alias})`;
    container.appendChild(monthHeader);

    // Create table elements
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Populate the header
    const headerRow = document.createElement('tr');
    for (const day of props.calendar.days) {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);

    // Populate the body with days of the month
    const firstDay = calculateFirstDay(yearId, monthName);
    let dayIndex = 0;
    while (dayIndex < month.days) {
        dayIndex = renderWeek(tbody, dayIndex, firstDay, props.calendar.days.length, month.days, fullMoonDay);
    }

    // Append the table
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);

    return container;
}

function renderFestival(yearId, festivalName, currentDay) {
    const festival = props.calendar.months.find(m => m.name === festivalName);
    if (festival.hasLeapDay && !isLeapYear(yearId)) {
        return;
    }

    const container = document.createElement('div');
    if (!festival) {
        console.error('Festival not found');
        return;
    }

    const fullMoonDay = getMonthFullMoonDay(yearId, festival.name);

    const monthHeader = document.createElement("h3");
    monthHeader.textContent = `${festival.name} Festival`;
    if (fullMoonDay === 1) {
        monthHeader.classList.add('full-moon');
    }
    if (currentDay === 1) {
        monthHeader.classList.add('current-day');
    }
    container.appendChild(monthHeader);

    return container;
}

function renderYear(yearId, currentMonth, currentDay) {
    // Assuming you have a container with the ID 'calendarContainer' in your HTML
    const container = document.getElementById('calendarContainer');
    container.innerHTML = ''; // Clear previous content

    for (const month of props.calendar.months) {
        const currentDayOfMonth = month.name === currentMonth ? currentDay : 0;
        if (month.isFestival) {
            const fesivalElement = renderFestival(yearId, month.name, currentDayOfMonth);
            if (fesivalElement) {
                container.appendChild(fesivalElement);
            }
            continue;
        }
        container.appendChild(renderMonth(yearId, month.name, currentDayOfMonth));
    }
}

function renderInput() {
    function handleYearRender() {
        const year = document.getElementById('yearInput').value;
        const month = document.getElementById('monthInput').value;
        const day = +document.getElementById('dayInput').value;
        renderYear(year, month, day);
    };

    const container = document.getElementById('inputContainer');
    container.innerHTML = ''; // Clear previous content

    // Year input

    const yearInputContainer = document.createElement('div');
    yearInputContainer.textContent = 'Year: ';
    const yearInput = document.createElement('input');
    yearInput.type = 'number';
    yearInput.id = 'yearInput';
    yearInput.placeholder = 'Enter year';
    yearInput.value = 1500;
    yearInputContainer.appendChild(yearInput);
    container.appendChild(yearInputContainer);
    
    yearInput.onchange = () => {
        const value = document.getElementById('yearInput').value;
        document.getElementById('monthInput')
            .querySelectorAll('.festival.leap-day')
            .forEach(option => option.disabled = !isLeapYear(value));
        handleYearRender();
    };

    // Month input

    const monthInputContainer = document.createElement('div');
    monthInputContainer.textContent = 'Month: ';
    const monthInput = document.createElement('select');
    monthInput.id = 'monthInput';
    for (const month of props.calendar.months) {
        const option = document.createElement('option');
        option.value = month.name;
        option.textContent = `${month.isFestival ? '[Day] ' : ''}${month.name}`;
        month.isFestival && option.classList.add('festival');
        month.hasLeapDay && option.classList.add('leap-day');
        monthInput.appendChild(option);
    }
    monthInputContainer.appendChild(monthInput);
    container.appendChild(monthInputContainer);

    monthInput.onchange = () => {
        const value = document.getElementById('monthInput').value;
        const month = props.calendar.months.find(m => m.name === value);
        const dayInput = document.getElementById('dayInput');
        dayInput.disabled = month.isFestival;
        if (month.isFestival) {
            dayInput.value = 1;
        }
        handleYearRender();
    }

    // Day input

    const dayInputContainer = document.createElement('div');
    dayInputContainer.textContent = 'Day: ';
    const dayInput = document.createElement('input');
    dayInput.type = 'number';
    dayInput.id = 'dayInput';
    dayInput.placeholder = 'Enter day';
    dayInput.value = 1;
    dayInputContainer.appendChild(dayInput);
    container.appendChild(dayInputContainer);

    dayInput.onchange = handleYearRender;

    // Calculator

    const calculatorContainer = document.createElement('div');
    calculatorContainer.textContent = 'Add days: ';

    const calculatorInput = document.createElement('input');
    calculatorInput.type = 'number';
    calculatorInput.id = 'calculatorInput';
    calculatorInput.value = 0;
    calculatorContainer.appendChild(calculatorInput);

    const calculatorButton = document.createElement('button');
    calculatorButton.textContent = 'Add';
    calculatorButton.onclick = () => {
        const dayInput = document.getElementById('dayInput');
        const newDate = calculateDate(
            {
                year: +document.getElementById('yearInput').value, 
                month: document.getElementById('monthInput').value, 
                day: +dayInput.value
            }, 
            +calculatorInput.value
        );
        document.getElementById('yearInput').value = newDate.year;
        document.getElementById('monthInput').value = newDate.month;
        document.getElementById('dayInput').value = newDate.day;
        handleYearRender();
    };
    calculatorContainer.appendChild(calculatorButton);

    container.appendChild(calculatorContainer);


    handleYearRender();
}

renderInput();
