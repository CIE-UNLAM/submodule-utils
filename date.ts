export function createDateWithoutTimezone(d: string): Date {
    let date = new Date(d);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset);
}