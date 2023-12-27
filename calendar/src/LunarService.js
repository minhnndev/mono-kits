const removeFractionalPart = number => parseInt(number);

/* Compute the (integral) Julian day number of day dd/mm/yyyy, i.e., the number
 * of days between 1/1/4713 BC (Julian calendar) and dd/mm/yyyy.
 * Formula from http://www.tondering.dk/claus/calendar.html
 */
const jdFromDate = (dd, mm, yy) => {
  let a, y, m, jd;
  a = removeFractionalPart((14 - mm) / 12);
  y = yy + 4800 - a;
  m = mm + 12 * a - 3;
  jd = dd + removeFractionalPart((153 * m + 2) / 5) + 365 * y + removeFractionalPart(y / 4) - removeFractionalPart(y / 100) +
    removeFractionalPart(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + removeFractionalPart((153 * m + 2) / 5) + 365 * y + removeFractionalPart(y / 4) - 32083;
  }
  return jd;
}

/* Convert a Julian day number to day/month/year. Parameter jd is an integer */
const jdToDate = (jd) => {
  let a, b, c, d, e, m, day, month, year;
  if (jd > 2299160) { // After 5/10/1582, Gregorian calendar
    a = jd + 32044;
    b = removeFractionalPart((4 * a + 3) / 146097);
    c = a - removeFractionalPart((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  d = removeFractionalPart((4 * c + 3) / 1461);
  e = c - removeFractionalPart((1461 * d) / 4);
  m = removeFractionalPart((5 * e + 2) / 153);
  day = e - removeFractionalPart((153 * m + 2) / 5) + 1;
  month = m + 3 - 12 * removeFractionalPart(m / 10);
  year = b * 100 + d - 4800 + removeFractionalPart(m / 10);
  return [day, month, year];
}

/* Compute the time of the k-th new moon after the new moon of 1/1/1900 13:52 UCT
 * (measured as the number of days since 1/1/4713 BC noon UCT, e.g., 2451545.125 is 1/1/2000 15:00 UTC).
 * Returns a floating number, e.g., 2415079.9758617813 for k=2 or 2414961.935157746 for k=-2
 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
 */
const NewMoon = (k) => {
  let T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
  T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
  T2 = T * T;
  T3 = T2 * T;
  dr = Math.PI / 180;
  Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 *
    Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr); // Mean new moon
  M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 -
    0.00000347 * T3; // Sun's mean anomaly
  Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 +
    0.00001236 * T3; // Moon's mean anomaly
  F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 -
    0.00000239 * T3; // Moon's argument of latitude
  C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 -
      0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  JdNew = Jd1 + C1 - deltat;
  return JdNew;
}

/* Compute the longitude of the sun at any time.
 * Parameter: floating number jdn, the number of days since 1/1/4713 BC noon
 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
 */
const SunLongitude = (jdn) =>  {
  let T, T2, dr, M, L0, DL, L;
  T = (jdn - 2451545.0) /
    36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
  T2 = T * T;
  dr = Math.PI / 180; // degree to radian
  M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 -
    0.00000048 * T * T2; // mean anomaly, degree
  L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
  DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
    0.000290 * Math.sin(dr * 3 * M);
  L = L0 + DL; // true longitude, degree
  L = L * dr;
  L = L - Math.PI * 2 * (Math.sin(L / (Math.PI * 2))); // Normalize to (0, 2*PI)
  return L;
}

/* Compute sun position at midnight of the day with the given Julian day number.
 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00.
 * The  returns a number between 0 and 11.
 * From the day after March equinox and the 1st major term after March equinox, 0 is returned.
 * After that, return 1, 2, 3 ...
 */
const getSunLongitude = (dayNumber, timeZone) => {
  return removeFractionalPart(SunLongitude(dayNumber - 0.5 - timeZone / 24) / Math.PI * 6);
}

/* Compute the day of the k-th new moon in the given time zone.
 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00
 */
const getNewMoonDay = (k, timeZone) => {
  return removeFractionalPart(NewMoon(k) + 0.5 + timeZone / 24);
}

/* Find the day that starts the luner month 11 of the given year for the given time zone */
const getLunarMonth11 = (yy, timeZone) => {
  let k, off, nm, sunLong;
  //off = jdFromDate(31, 12, yy) - 2415021.076998695;
  off = jdFromDate(31, 12, yy) - 2415021;
  k = removeFractionalPart(off / 29.530588853);
  nm = getNewMoonDay(k, timeZone);
  sunLong = getSunLongitude(nm, timeZone); // sun longitude at local midnight
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

/* Find the index of the leap month after the month starting on the day a11. */
const getLeapMonthOffset = (a11, timeZone) => {
  let k, last, arc, i;
  k = removeFractionalPart((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  last = 0;
  i = 1; // We start with the month following lunar month 11
  arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/* Comvert solar date dd/mm/yyyy to the corresponding lunar date */
export const convertSolar2Lunar = (dd, mm, yy, timeZone) => {
  let k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth, lunarYear,
    lunarLeap;
  dayNumber = jdFromDate(dd, mm, yy);
  k = removeFractionalPart((dayNumber - 2415021.076998695) / 29.530588853);
  monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  //alert(dayNumber+" -> "+monthStart);
  a11 = getLunarMonth11(yy, timeZone);
  b11 = a11;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  lunarDay = dayNumber - monthStart + 1;
  let diff = removeFractionalPart((monthStart - a11) / 29);
  lunarLeap = 0;
  lunarMonth = diff + 10;
  if (b11 - a11 > 365) {
    let leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = 1;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return { lunarDay, lunarMonth: lunarMonth, lunarYear, isleap: lunarLeap};
}