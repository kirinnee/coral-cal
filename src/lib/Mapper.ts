import {Session, SessionRaw, TimetableEvent, TimetableEventRaw} from "./TimetableEvent";
import {DateTimeFormatter, DayOfWeek, LocalTime} from "@js-joda/core";

const dayOfWeek: { [key: string]: number } = {
    "MON": 1,
    "TUE": 2,
    "WED": 3,
    "THU": 4,
    "FRI": 5,
    "SAT": 6,
    "SUN": 7,
}

interface Mapper {
    
    MapTimeTable(raw: TimetableEventRaw): TimetableEvent[];
    
    MapSession(raw: SessionRaw): Session;
}

class SimpleMapper implements Mapper {
    MapSession(raw: SessionRaw): Session {
        const f = DateTimeFormatter.ofPattern("HHmm");
        return {
            Type: raw.Type,
            Group: raw.Group,
            Day: DayOfWeek.of(dayOfWeek[raw.Day]),
            StartTime: LocalTime.parse(raw.StartTime, f),
            EndTime: LocalTime.parse(raw.EndTime, f),
            Location: raw.Location,
            Weeks: raw.Weeks,
        } as Session;
    }
    
    MapTimeTable(raw: TimetableEventRaw): TimetableEvent[] {
        return raw.sessions
           .Map(x => {
               return {
                   course: raw.course,
                   session: this.MapSession(x)
               } as TimetableEvent
           });
    }
    
    
}

export type {
    Mapper
}
export {
    SimpleMapper
}
