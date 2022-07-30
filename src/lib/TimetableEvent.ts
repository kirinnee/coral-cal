import {DayOfWeek, LocalTime} from "@js-joda/core";

interface TimetableEvent {
    course: Course;
    session: Session;
}

interface Course {
    Code: string
    Name: string
    AU: number
    CourseType: string
    CourseGroup: string
    SUOption: string
    Index: number
    Status: string
}

interface Session {
    Type: string
    Group: string
    Day: DayOfWeek
    StartTime: LocalTime
    EndTime: LocalTime
    Location: string
    Weeks: number[]
}

interface SessionRaw {
    Type: string
    Group: string
    Day: string
    StartTime: string
    EndTime: string
    Location: string
    Weeks: number[]
}

interface TimetableEventRaw {
    course: Course;
    sessions: SessionRaw[];
}

export type {TimetableEvent, TimetableEventRaw, Session, Course, SessionRaw}
