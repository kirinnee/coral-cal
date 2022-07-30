import {should, describe, it} from 'vitest'
import {SimpleMapper} from "../src/lib/Mapper";
import {Session, SessionRaw} from "../src/lib/TimetableEvent";
import {DayOfWeek, LocalTime} from "@js-joda/core";

should();

describe('SimpleMapper', function () {
    const mapper = new SimpleMapper();
    
    describe('MapSession', function () {
        it.each([
            [
                {
                    Type: "LEC/STUDIO",
                    Group: "F51",
                    Day: "WED",
                    StartTime: "1330",
                    EndTime: "1620",
                    Location: "S2-B4C-17 [Communication (S2)]",
                    Weeks: [9, 10, 12, 13],
                },
                {
                    Type: "LEC/STUDIO",
                    Group: "F51",
                    Day: DayOfWeek.WEDNESDAY,
                    StartTime: LocalTime.of(13,30),
                    EndTime: LocalTime.of(16,20),
                    Location: "S2-B4C-17 [Communication (S2)]",
                    Weeks: [9, 10, 12, 13],
                },
            ],
            [
                {
                    Type: "LEC/STUDIO",
                    Group: "F51",
                    Day: "MON",
                    StartTime: "1430",
                    EndTime: "1720",
                    Location: "LT28 [LT28 (SS)]",
                    Weeks: [1, 2, 3, 4, 5, 6, 7, 8, 11],
                },
                {
                    Type: "LEC/STUDIO",
                    Group: "F51",
                    Day: DayOfWeek.MONDAY,
                    StartTime: LocalTime.of(14,30),
                    EndTime: LocalTime.of(17,20),
                    Location: "LT28 [LT28 (SS)]",
                    Weeks: [1, 2, 3, 4, 5, 6, 7, 8, 11],
                },
            ],
            [
                {
                    Type: "LEC/STUDIO",
                    Group: "EELE",
                    Day: "MON",
                    StartTime: "0930",
                    EndTime: "1020",
                    Location: "LHS-LT [LT (HIVE)]",
                    Weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                },
                {
                    Type: "LEC/STUDIO",
                    Group: "EELE",
                    Day: DayOfWeek.MONDAY,
                    StartTime: LocalTime.of(9,30),
                    EndTime: LocalTime.of(10,20),
                    Location: "LHS-LT [LT (HIVE)]",
                    Weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                },
            ],
            [
                {
                    Type: "LEC/STUDIO",
                    Group: "EELE",
                    Day: "THU",
                    StartTime: "1030",
                    EndTime: "1220",
                    Location: "LHS-LT [LT (HIVE)]",
                    Weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                },
                {
                    Type: "LEC/STUDIO",
                    Group: "EELE",
                    Day: DayOfWeek.THURSDAY,
                    StartTime: LocalTime.of(10,30),
                    EndTime: LocalTime.of(12,20),
                    Location: "LHS-LT [LT (HIVE)]",
                    Weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                },
            ]
            
        ] as [SessionRaw, Session][])
          ('should map a raw session into a domain session', function (subject: SessionRaw, expected: Session) {
                const actual = mapper.MapSession(subject);
                actual.should.deep.equal(expected);
        });
    });
    
    
    
    
});
