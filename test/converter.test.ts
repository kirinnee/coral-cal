import {should, describe, it} from 'vitest'
import {TimetableEventRaw} from "../src/lib/TimetableEvent";
import {RealConverter} from "../src/lib/Converter";
import {Kore} from "@kirinnee/core";

should();

const core = new Kore();
core.ExtendPrimitives();

describe("RealConverter", () => {
    const converter = new RealConverter(core);
    
    describe('parseTime', function () {
        it.each(
            [
                [
                    "0000-1200", ["0000", "1200"] as [string, string],
                    "0930-1220", ["9030", "1220"],
                    "1030-1150", ["1030", "1150"],
                    "1330-1620", ["1330", "1620"],
                    "0930-1020", ["0930", "1020"],
                ]
            ]
        )
          ('should split a single time field into 2', function (subject: string, expected: [string, string]) {
              const actual = converter.parseTime(subject);
              actual.should.deep.equal(expected);
          });
    });
    
    describe('parseWeek', function () {
        it.each([
            ["Teaching Wk6,12", [6, 12]],
            ["Teaching Wk9,10,12,13", [9, 10, 12, 13]],
            ["Teaching Wk1-8,11", [1, 2, 3, 4, 5, 6, 7, 8, 11]],
            ["Teaching Wk1-13", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]],
            ["Teaching Wk12,13", [12, 13]],
            ["Teaching Wk1-11", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
        ])
          ('should convert week string into an array of applicable weeks', function (input: string, expected: number[]) {
              const actual = converter.parseWeek(input);
              actual.should.deep.eq(expected);
          });
    });
    
    describe('Convert', function () {
        it.each([
            [
                "3001L\tENGINEERING ELECTROMAGNETICS\t0\tCORE\t \t \t32091\tREGISTERED\t \tLAB\tEL23\tTUE\t0930-1220\tS2-B4C-17.\tTeaching Wk6,12",
                {
                    course: {
                        AU: 0,
                        CourseGroup: " ",
                        CourseType: "CORE",
                        Code: "3001L",
                        Index: 32091,
                        Name: "ENGINEERING ELECTROMAGNETICS",
                        Status: "REGISTERED",
                        SUOption: " "
                    },
                    sessions: [
                        {
                            Day: "TUE",
                            Group: "EL23",
                            EndTime: "1220",
                            StartTime: "0930",
                            Location: "S2-B4C-17.",
                            Type: "LAB",
                            Weeks: [6, 12],
                        }
                    ]
                },
            ],
            [
                "EE3001\tENGINEERING ELECTROMAGNETICS\t4\tCORE\t \t \t32292\tREGISTERED\t \tTUT\tEE28\tFRI\t1030-1150\tTR+95    [Tutorial Room + 95 (SS)]\tTeaching Wk1-13",
                {
                    course: {
                        AU: 4,
                        CourseGroup: " ",
                        CourseType: "CORE",
                        Code: "EE3001",
                        Index: 32292,
                        Name: "ENGINEERING ELECTROMAGNETICS",
                        Status: "REGISTERED",
                        SUOption: " "
                    },
                    sessions: [
                        {
                            Type: "TUT",
                            Group: "EE28",
                            Day: "FRI",
                            StartTime: "1030",
                            EndTime: "1150",
                            Location: "TR+95    [Tutorial Room + 95 (SS)]",
                            Weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                        }
                    ]
                },
            ],
        ])('should convert single session events into a raw event', function (subject: string, expected: TimetableEventRaw) {
            
            // when
            const actual = converter.Convert(subject);
            
            // then
            actual.should.deep.equal(expected);
            
        });
        
        it.each(
            [
                // case 1
                [
                    `IE4110\tOPTICAL COMMUNICATION SYSTEM DESIGN\t2\tPRESCRIBED\t \t \t32009\tREGISTERED\t \tLEC/STUDIO\tF51\tWED\t1330-1620\tS2-B4C-17
[Communication (S2)]\tTeaching Wk9,10,12,13
LEC/STUDIO\tF51\tMON\t1430-1720\tLT28
[LT28 (SS)]\tTeaching Wk1-8,11`,
                    {
                        course: {
                            Code: "IE4110",
                            Name: "OPTICAL COMMUNICATION SYSTEM DESIGN",
                            AU: 2,
                            CourseType: "PRESCRIBED",
                            CourseGroup: " ",
                            SUOption: " ",
                            Index: 32009,
                            Status: "REGISTERED",
                        },
                        sessions: [
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
                                Day: "MON",
                                StartTime: "1430",
                                EndTime: "1720",
                                Location: "LT28 [LT28 (SS)]",
                                Weeks: [1, 2, 3, 4, 5, 6, 7, 8, 11],
                            }
                        ]
                    },
                ],
                // case 2
                [
                    `IE4491\tPROBABILITY THEORY & APPLICATIONS\t3\tPRESCRIBED\t \t \t32353\tREGISTERED\t \tLEC/STUDIO\tEELE\tMON\t0930-1020\tLHS-LT
[LT (HIVE)]\tTeaching Wk1-13
LEC/STUDIO\tEELE\tTHU\t1030-1220\tLHS-LT
[LT (HIVE)]\tTeaching Wk1-13`,
                    {
                        course: {
                            Code: "IE4491",
                            Name: "PROBABILITY THEORY & APPLICATIONS",
                            AU: 3,
                            CourseType: "PRESCRIBED",
                            CourseGroup: " ",
                            SUOption: " ",
                            Index: 32353,
                            Status: "REGISTERED",
                        },
                        sessions: [
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
                                Day: "THU",
                                StartTime: "1030",
                                EndTime: "1220",
                                Location: "LHS-LT [LT (HIVE)]",
                                Weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                            }
                        ]
                    },
                ],
                // case 3
                [
                    `IE4717\tWEB APPLICATION DESIGN\t2\tPRESCRIBED\t \t \t32372\tREGISTERED\t \tLEC/STUDIO\tF38\tSAT\t1330-1420\tRECORDED\tTeaching Wk1-11
LEC/STUDIO\tF38\tTHU\t1330-1620\tS2-B3B-08.\tTeaching Wk12,13
LEC/STUDIO\tF38\tTHU\t1330-1520\tS2-B3B-08.\tTeaching Wk1-11`,
                    {
                        course: {
                            Code: "IE4717",
                            Name: "WEB APPLICATION DESIGN",
                            AU: 2,
                            CourseType: "PRESCRIBED",
                            CourseGroup: " ",
                            SUOption: " ",
                            Index: 32372,
                            Status: "REGISTERED",
                        },
                        sessions: [
                            {
                                Type: "LEC/STUDIO",
                                Group: "F38",
                                Day: "SAT",
                                StartTime: "1330",
                                EndTime: "1420",
                                Location: "RECORDED",
                                Weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                            },
                            {
                                Type: "LEC/STUDIO",
                                Group: "F38",
                                Day: "THU",
                                StartTime: "1330",
                                EndTime: "1620",
                                Location: "S2-B3B-08.",
                                Weeks: [12,13],
                            },
                            {
                                Type: "LEC/STUDIO",
                                Group: "F38",
                                Day: "THU",
                                StartTime: "1330",
                                EndTime: "1520",
                                Location: "S2-B3B-08.",
                                Weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                            },
                        ]
                    },
                ],
                // case 4
                [
                    `IE4758\tINFORMATION SECURITY\t3\tPRESCRIBED\t \t \t32375\tREGISTERED\t \tLEC/STUDIO\tEELE\tFRI\t0930-1020\tLT25
[LT25 (SS)]\tTeaching Wk1-13
LEC/STUDIO\tEELE\tMON\t1030-1220\tLT27
[LT27 (SS)]\tTeaching Wk1-13`,
                    {
                        course: {
                            Code: "IE4758",
                            Name: "INFORMATION SECURITY",
                            AU: 3,
                            CourseType: "PRESCRIBED",
                            CourseGroup: " ",
                            SUOption: " ",
                            Index: 32375,
                            Status: "REGISTERED",
                        },
                        sessions: [
                            {
                                Type: "LEC/STUDIO",
                                Group: "EELE",
                                Day: "FRI",
                                StartTime: "0930",
                                EndTime: "1020",
                                Location: "LT25 [LT25 (SS)]",
                                Weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                            },
                            {
                                Type: "LEC/STUDIO",
                                Group: "EELE",
                                Day: "MON",
                                StartTime: "1030",
                                EndTime: "1220",
                                Location: "LT27 [LT27 (SS)]",
                                Weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ,13],
                            },
                        ]
                    },
                ],
            ]
        )('should convert multi session into a raw event', function (subject: string, expected: TimetableEventRaw) {
            // when
            const actual = converter.Convert(subject);
            
            // then
            actual.should.deep.equal(expected);
        });
        
    });
    
    describe('Parse', function () {
        it('should break a full timetable string into multiple course strings', function () {
            const subj = `E3001L\tENGINEERING ELECTROMAGNETICS\t0\tCORE\t \t \t32091\tREGISTERED\t \tLAB\tEL23\tTUE\t0930-1220\tS2-B4C-17.\tTeaching Wk6,12
EE3001\tENGINEERING ELECTROMAGNETICS\t4\tCORE\t \t \t32292\tREGISTERED\t \tTUT\tEE28\tFRI\t1030-1150\tTR+95
[Tutorial Room + 95 (SS)]\tTeaching Wk1-13
IE4110\tOPTICAL COMMUNICATION SYSTEM DESIGN\t2\tPRESCRIBED\t \t \t32009\tREGISTERED\t \tLEC/STUDIO\tF51\tWED\t1330-1620\tS2-B4C-17
[Communication (S2)]\tTeaching Wk9,10,12,13
LEC/STUDIO\tF51\tMON\t1430-1720\tLT28
[LT28 (SS)]\tTeaching Wk1-8,11
IE4491\tPROBABILITY THEORY & APPLICATIONS\t3\tPRESCRIBED\t \t \t32353\tREGISTERED\t \tLEC/STUDIO\tEELE\tMON\t0930-1020\tLHS-LT
[LT (HIVE)]\tTeaching Wk1-13
LEC/STUDIO\tEELE\tTHU\t1030-1220\tLHS-LT
[LT (HIVE)]\tTeaching Wk1-13
IE4717\tWEB APPLICATION DESIGN\t2\tPRESCRIBED\t \t \t32372\tREGISTERED\t \tLEC/STUDIO\tF38\tSAT\t1330-1420\tRECORDED\tTeaching Wk1-11
LEC/STUDIO\tF38\tTHU\t1330-1620\tS2-B3B-08.\tTeaching Wk12,13
LEC/STUDIO\tF38\tTHU\t1330-1520\tS2-B3B-08.\tTeaching Wk1-11
IE4758\tINFORMATION SECURITY\t3\tPRESCRIBED\t \t \t32375\tREGISTERED\t \tLEC/STUDIO\tEELE\tFRI\t0930-1020\tLT25
[LT25 (SS)]\tTeaching Wk1-13
LEC/STUDIO\tEELE\tMON\t1030-1220\tLT27
[LT27 (SS)]\tTeaching Wk1-13`;
            const expected = [
                `E3001L\tENGINEERING ELECTROMAGNETICS\t0\tCORE\t \t \t32091\tREGISTERED\t \tLAB\tEL23\tTUE\t0930-1220\tS2-B4C-17.\tTeaching Wk6,12`,
                `EE3001\tENGINEERING ELECTROMAGNETICS\t4\tCORE\t \t \t32292\tREGISTERED\t \tTUT\tEE28\tFRI\t1030-1150\tTR+95
[Tutorial Room + 95 (SS)]\tTeaching Wk1-13`,
                `IE4110\tOPTICAL COMMUNICATION SYSTEM DESIGN\t2\tPRESCRIBED\t \t \t32009\tREGISTERED\t \tLEC/STUDIO\tF51\tWED\t1330-1620\tS2-B4C-17
[Communication (S2)]\tTeaching Wk9,10,12,13
LEC/STUDIO\tF51\tMON\t1430-1720\tLT28
[LT28 (SS)]\tTeaching Wk1-8,11`,
                `IE4491\tPROBABILITY THEORY & APPLICATIONS\t3\tPRESCRIBED\t \t \t32353\tREGISTERED\t \tLEC/STUDIO\tEELE\tMON\t0930-1020\tLHS-LT
[LT (HIVE)]\tTeaching Wk1-13
LEC/STUDIO\tEELE\tTHU\t1030-1220\tLHS-LT
[LT (HIVE)]\tTeaching Wk1-13`,
                `IE4717\tWEB APPLICATION DESIGN\t2\tPRESCRIBED\t \t \t32372\tREGISTERED\t \tLEC/STUDIO\tF38\tSAT\t1330-1420\tRECORDED\tTeaching Wk1-11
LEC/STUDIO\tF38\tTHU\t1330-1620\tS2-B3B-08.\tTeaching Wk12,13
LEC/STUDIO\tF38\tTHU\t1330-1520\tS2-B3B-08.\tTeaching Wk1-11`,
                `IE4758\tINFORMATION SECURITY\t3\tPRESCRIBED\t \t \t32375\tREGISTERED\t \tLEC/STUDIO\tEELE\tFRI\t0930-1020\tLT25
[LT25 (SS)]\tTeaching Wk1-13
LEC/STUDIO\tEELE\tMON\t1030-1220\tLT27
[LT27 (SS)]\tTeaching Wk1-13`,
            ];
            
            // When
            const actual = converter.Parse(subj);
            
            actual[0].should.deep.eq(expected[0]);
            actual[1].should.deep.eq(expected[1]);
            actual[2].should.deep.eq(expected[2]);
            actual[3].should.deep.eq(expected[3]);
            actual[4].should.deep.eq(expected[4]);
            actual[5].should.deep.eq(expected[5]);
        });
    });
});
