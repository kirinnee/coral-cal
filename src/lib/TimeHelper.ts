import {ChronoField, DayOfWeek, Instant, LocalDate, LocalTime, ZonedDateTime, ZoneId} from "@js-joda/core";

interface TimeHelper {
    GetDay(week: number, day: DayOfWeek, time: LocalTime): ZonedDateTime;
}

class JodaTimeHelper implements TimeHelper {
    
    private baseLine: LocalDate;
    private tz = ZoneId.of("Singapore");
    
    constructor(baseLine: LocalDate) {
        this.baseLine = baseLine;
    }
    
    GetDay(week: number, day: DayOfWeek, time: LocalTime): ZonedDateTime {
        if (week < 8) {
            week -= 1;
        }
        return this.baseLine
                   .plusWeeks(week)
                   .with(ChronoField.DAY_OF_WEEK, day.value())
                   .atTime(time)
                   .atZone(this.tz);
    }
    
    
}

export type {TimeHelper}
export {JodaTimeHelper}
