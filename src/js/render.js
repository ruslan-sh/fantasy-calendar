import { props } from "./props.js";
import { calculateDate, getMonthMoonCycle, isLeapYear } from "./logic.js";

function renderMoonCycle(moonCycle, dayId, element) {
    for (const [fullMoon, halfWaning, newMoon, halfWaxing] of moonCycle) {
        if (dayId === fullMoon) {
            element.classList.add("full-moon");
            break;
        } else if (dayId === halfWaning) {
            element.classList.add("half-waning");
            break;
        } else if (dayId === newMoon) {
            element.classList.add("new-moon");
            break;
        } else if (dayId === halfWaxing) {
            element.classList.add("half-waxing");
            break;
        }
    }

    const moonSymbol = document.createElement("span");
    moonSymbol.classList.add("moon-symbol");
    element.appendChild(moonSymbol);
}

function renderMonth(yearId, monthName, currentDay) {
    function calculateFirstDay(/*yearId, monthName*/) {
        return 0; // Assuming the first day of every month is the first day of the week
    }

    function renderWeek(
        tbody,
        dayIndex,
        firstDay,
        weekLength,
        monthDays,
        moonCycle
    ) {
        const tr = document.createElement("tr");
        for (let i = 0; i < weekLength; i++) {
            const td = document.createElement("td");
            if (dayIndex === 0) {
                if (i < firstDay) {
                    td.textContent = "";
                    tr.appendChild(td);
                    continue;
                }
            }

            if (dayIndex >= monthDays) {
                td.textContent = "";
                tr.appendChild(td);
                continue;
            }

            td.textContent = ++dayIndex;
            if (dayIndex === currentDay) {
                td.classList.add("current-day");
            }

            renderMoonCycle(moonCycle, dayIndex, td);

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
        return dayIndex;
    }

    const month = props.calendar.months.find((m) => m.name === monthName);
    if (!month) {
        throw "Month not found";
    }

    const moonCycle = getMonthMoonCycle(yearId, monthName);

    const container = document.createElement("div");
    const monthHeader = document.createElement("h2");
    monthHeader.textContent = `${month.name}`;
    container.appendChild(monthHeader);

    const monthAlias = document.createElement("p");
    monthAlias.classList.add("sub-header");
    monthAlias.textContent = month.alias || "";
    container.appendChild(monthAlias);

    // Create table elements
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Populate the header
    const headerRow = document.createElement("tr");
    for (const day of props.calendar.days) {
        const th = document.createElement("th");
        th.textContent = day.short;
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);

    // Populate the body with days of the month
    const firstDay = calculateFirstDay(yearId, monthName);
    let dayIndex = 0;
    while (dayIndex < month.days) {
        dayIndex = renderWeek(
            tbody,
            dayIndex,
            firstDay,
            props.calendar.days.length,
            month.days,
            moonCycle
        );
    }

    // Append the table
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);

    return container;
}

function renderFestival(yearId, festivalName, currentDay) {
    const festival = props.calendar.months.find((m) => m.name === festivalName);
    if (festival.hasLeapDay && !isLeapYear(yearId)) {
        return;
    }

    const container = document.createElement("div");
    container.classList.add("festival-container");
    if (!festival) {
        throw "Festival not found";
    }

    const monthHeader = document.createElement("h3");
    monthHeader.textContent = `${festival.name} Festival`;
    if (currentDay === 1) {
        monthHeader.classList.add("current-day");
    }

    const moonCycle = getMonthMoonCycle(yearId, festivalName);
    renderMoonCycle(moonCycle, 1, monthHeader);

    container.appendChild(monthHeader);

    return container;
}

function renderYear(yearId, currentMonth, currentDay) {
    // Assuming you have a container with the ID 'calendarContainer' in your HTML
    const container = document.getElementById("calendarContainer");
    container.innerHTML = ""; // Clear previous content

    const yearHeader = document.createElement("h1");
    yearHeader.textContent = `${yearId} ${props.calendar.yearName}`;
    container.appendChild(yearHeader);

    const monthsContainer = document.createElement("div");
    monthsContainer.classList.add("months-container");
    let lastMonthContainer = null;
    for (const month of props.calendar.months) {
        const currentDayOfMonth = month.name === currentMonth ? currentDay : 0;
        if (month.isFestival) {
            const fesivalElement = renderFestival(
                yearId,
                month.name,
                currentDayOfMonth
            );
            if (fesivalElement) {
                lastMonthContainer.appendChild(fesivalElement);
            }
            continue;
        }
        lastMonthContainer = renderMonth(yearId, month.name, currentDayOfMonth);
        monthsContainer.appendChild(lastMonthContainer);
    }

    container.appendChild(monthsContainer);
}

export function renderInput() {
    function handleYearRender() {
        const year = document.getElementById("yearInput").value;
        const month = document.getElementById("monthInput").value;
        const day = +document.getElementById("dayInput").value;
        renderYear(year, month, day);
    }

    const container = document.getElementById("inputContainer");
    container.innerHTML = ""; // Clear previous content

    // Year input

    const yearInputContainer = document.createElement("div");
    yearInputContainer.textContent = "Year: ";
    const yearInput = document.createElement("input");
    yearInput.type = "number";
    yearInput.id = "yearInput";
    yearInput.placeholder = "Enter year";
    yearInput.value = 1500;
    yearInputContainer.appendChild(yearInput);
    container.appendChild(yearInputContainer);

    yearInput.onchange = () => {
        const value = document.getElementById("yearInput").value;
        document
            .getElementById("monthInput")
            .querySelectorAll(".festival.leap-day")
            .forEach((option) => (option.disabled = !isLeapYear(value)));
        handleYearRender();
    };

    // Month input

    const monthInputContainer = document.createElement("div");
    monthInputContainer.textContent = "Month: ";
    const monthInput = document.createElement("select");
    monthInput.id = "monthInput";
    for (const month of props.calendar.months) {
        const option = document.createElement("option");
        option.value = month.name;
        option.textContent = `${month.isFestival ? "[Day] " : ""}${month.name}`;
        month.isFestival && option.classList.add("festival");
        month.hasLeapDay && option.classList.add("leap-day");
        monthInput.appendChild(option);
    }
    monthInputContainer.appendChild(monthInput);
    container.appendChild(monthInputContainer);

    monthInput.onchange = () => {
        const value = document.getElementById("monthInput").value;
        const month = props.calendar.months.find((m) => m.name === value);
        const dayInput = document.getElementById("dayInput");
        dayInput.disabled = month.isFestival;
        if (month.isFestival) {
            dayInput.value = 1;
        }
        handleYearRender();
    };

    // Day input

    const dayInputContainer = document.createElement("div");
    dayInputContainer.textContent = "Day: ";
    const dayInput = document.createElement("input");
    dayInput.type = "number";
    dayInput.id = "dayInput";
    dayInput.placeholder = "Enter day";
    dayInput.value = 1;
    dayInputContainer.appendChild(dayInput);
    container.appendChild(dayInputContainer);

    dayInput.onchange = handleYearRender;

    // Calculator

    const calculatorContainer = document.createElement("div");
    calculatorContainer.textContent = "Add days: ";

    const calculatorInputContainer = document.createElement("span");
    const calculatorInput = document.createElement("input");
    calculatorInput.type = "number";
    calculatorInput.id = "calculatorInput";
    calculatorInput.value = 0;
    calculatorInputContainer.appendChild(calculatorInput);

    const calculatorButton = document.createElement("button");
    calculatorButton.textContent = "Add";
    calculatorButton.onclick = () => {
        const dayInput = document.getElementById("dayInput");
        const newDate = calculateDate(
            {
                year: +document.getElementById("yearInput").value,
                month: document.getElementById("monthInput").value,
                day: +dayInput.value,
            },
            +calculatorInput.value
        );
        document.getElementById("yearInput").value = newDate.year;
        document.getElementById("monthInput").value = newDate.month;
        document.getElementById("dayInput").value = newDate.day;
        handleYearRender();
    };
    calculatorInputContainer.appendChild(calculatorButton);
    calculatorInputContainer.classList.add("nowrap");
    calculatorContainer.appendChild(calculatorInputContainer);

    container.appendChild(calculatorContainer);

    const hideInputButton = document.createElement("span");
    hideInputButton.classList.add("material-icons");
    hideInputButton.classList.add("pointer");
    hideInputButton.classList.add("hide-input");
    hideInputButton.onclick = () => {
        container.classList.toggle("hidden");
    };
    container.appendChild(hideInputButton);

    handleYearRender();
}
