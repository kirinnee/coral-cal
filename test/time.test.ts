import {describe, it, should} from "vitest"
import {DayOfWeek, LocalDate, LocalTime, ZonedDateTime, ZoneId} from "@js-joda/core";
import "@js-joda/timezone";
import {JodaTimeHelper} from "../src/lib/TimeHelper";

should();


describe('TimeHelper', function () {
    const zone = ZoneId.of("Singapore");
    describe('Get Day with 2022 August as baseline', function () {
        it.each(
            [
                [
                    LocalDate.of(2022, 8, 9),
                    1, DayOfWeek.WEDNESDAY, LocalTime.of(13, 30),
                    ZonedDateTime.of(2022, 8, 10, 13, 30, 0, 0, zone)
                ],
                [
                    LocalDate.of(2022, 8, 9),
                    4, DayOfWeek.MONDAY, LocalTime.of(23, 45),
                    ZonedDateTime.of(2022, 8, 29, 23, 45, 0, 0, zone)
                ],
                [
                    LocalDate.of(2022, 8, 10),
                    3, DayOfWeek.TUESDAY, LocalTime.of(9, 0),
                    ZonedDateTime.of(2022, 8, 23, 9, 0, 0, 0, zone)
                ],
                [
                    LocalDate.of(2022, 8, 10),
                    12, DayOfWeek.SATURDAY, LocalTime.of(12, 34),
                    ZonedDateTime.of(2022, 11, 5, 12, 34, 0, 0, zone)
                ],
                [
                    LocalDate.of(2022, 8, 8),
                    10, DayOfWeek.FRIDAY, LocalTime.of(0, 15),
                    ZonedDateTime.of(2022, 10, 21, 0, 15, 0, 0, zone)
                ],
                [
                    LocalDate.of(2022, 8, 9),
                    7, DayOfWeek.THURSDAY, LocalTime.of(2, 59),
                    ZonedDateTime.of(2022, 9, 22, 2, 59, 0, 0, zone)
                ],
                [
                    LocalDate.of(2022, 8, 13),
                    8, DayOfWeek.MONDAY, LocalTime.of(20, 2),
                    ZonedDateTime.of(2022, 10, 3, 20, 2, 0, 0, zone)
                ],
                [
                    LocalDate.of(2022, 8, 11),
                    6, DayOfWeek.TUESDAY, LocalTime.of(2, 59),
                    ZonedDateTime.of(2022, 9, 13, 2, 59, 0, 0, zone)
                ],
                [
                    LocalDate.of(2022, 8, 12),
                    9, DayOfWeek.WEDNESDAY, LocalTime.of(17, 20),
                    ZonedDateTime.of(2022, 10, 12, 17, 20, 0, 0, zone)
                ],
                [
                    LocalDate.of(2022, 8, 8),
                    9, DayOfWeek.FRIDAY, LocalTime.of(15, 48),
                    ZonedDateTime.of(2022, 10, 14, 15, 48, 0, 0, zone)
                ],
                [
                    LocalDate.of(2023, 1, 9),
                    1, DayOfWeek.FRIDAY, LocalTime.of(14, 35),
                    ZonedDateTime.of(2023, 1, 13, 14, 35, 0, 0, zone)
                ],
                [
                    LocalDate.of(2023, 1, 9),
                    4, DayOfWeek.SATURDAY, LocalTime.of(20, 40),
                    ZonedDateTime.of(2023, 2, 4, 20, 40, 0, 0, zone)
                ],
                [
                    LocalDate.of(2023, 1, 9),
                    3, DayOfWeek.MONDAY, LocalTime.of(23, 59),
                    ZonedDateTime.of(2023, 1, 23, 23, 59, 0, 0, zone)
                ],
                [
                    LocalDate.of(2023, 1, 9),
                    12, DayOfWeek.WEDNESDAY, LocalTime.of(11, 10),
                    ZonedDateTime.of(2023, 4, 5, 11, 10, 0, 0, zone)
                ],
                [
                    LocalDate.of(2023, 1, 9),
                    10, DayOfWeek.TUESDAY, LocalTime.of(6, 2),
                    ZonedDateTime.of(2023, 3, 21, 6, 2, 0, 0, zone)
                ],
                [
                    LocalDate.of(2023, 1, 11),
                    7, DayOfWeek.TUESDAY, LocalTime.of(7, 12),
                    ZonedDateTime.of(2023, 2, 21, 7, 12, 0, 0, zone)
                ],
                [
                    LocalDate.of(2023, 1, 10),
                    8, DayOfWeek.THURSDAY, LocalTime.of(20, 2),
                    ZonedDateTime.of(2023, 3, 9, 20, 2, 0, 0, zone)
                ],
                [
                    LocalDate.of(2023, 1, 9),
                    6, DayOfWeek.THURSDAY, LocalTime.of(2, 59),
                    ZonedDateTime.of(2023, 2, 16, 2, 59, 0, 0, zone)
                ],
                [
                    LocalDate.of(2023, 1, 13),
                    9, DayOfWeek.FRIDAY, LocalTime.of(16, 52),
                    ZonedDateTime.of(2023, 3, 17, 16, 52, 0, 0, zone)
                ],
                [
                    LocalDate.of(2023, 1, 12),
                    9, DayOfWeek.SATURDAY, LocalTime.of(22, 36),
                    ZonedDateTime.of(2023, 3, 18, 22, 36, 0, 0, zone)
                ],
            ]
        )('return the precise day and time given week, day and time', function (base: LocalDate, week: number, day: DayOfWeek, time: LocalTime, expected: ZonedDateTime) {
            //Given
            const timeHelper = new JodaTimeHelper(base);
            //When
            const actual = timeHelper.GetDay(week, day, time);
            // Then
            actual.should.deep.equal(expected);
        });
    });
});
