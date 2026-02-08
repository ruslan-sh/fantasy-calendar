import type { QueryParams } from "./types";

export function readQueryParams(): QueryParams {
    const urlParams = new URLSearchParams(window.location.search);
    const yearValue = urlParams.get("y");
    const dayValue = urlParams.get("d");

    return {
        year: yearValue === null ? null : Number(yearValue),
        month: urlParams.get("m"),
        day: dayValue === null ? null : Number(dayValue),
    };
}

export function writeQueryParams(year: number, month: string, day: number): void {
    const urlParams = new URLSearchParams();
    urlParams.set("y", year.toString());
    urlParams.set("m", month);
    urlParams.set("d", day.toString());
    window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
}
