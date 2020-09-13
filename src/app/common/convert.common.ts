export function timeStringToMillisecond(timeString: string): number {
  let condition = parseFloat(timeString.slice(-2, -1));

  if (condition) {
    return parseFloat(timeString.slice(0, -1)) * 1000;

  } else if ((() => condition = parseFloat(timeString.slice(-3, -2)))() || condition || condition === 0) {
    return parseFloat(timeString.slice(0, -2));

  } else { return NaN; }
}

