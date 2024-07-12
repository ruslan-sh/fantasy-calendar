export function readQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const year = urlParams.get("y");
    const month = urlParams.get("m");
    const day = urlParams.get("d");
    return { year, month, day };
}

export function writeQueryParams(year: number, month: string, day: number) {
    const urlParams = new URLSearchParams();
    urlParams.set("y", year.toString());
    urlParams.set("m", month.toString());
    urlParams.set("d", day.toString());
    window.history.pushState(
        {},
        "",
        `${window.location.pathname}?${urlParams}`
    );
}
