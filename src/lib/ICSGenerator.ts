import {TimetableEvent} from "./TimetableEvent";
import ical, {ICalEventBusyStatus, ICalEventData} from 'ical-generator';
import {DayOfWeek, LocalTime} from "@js-joda/core";
import {TimeHelper} from "./TimeHelper";

interface ICSGenerator {
    
    Create(event: TimetableEvent[]): Blob;
}


class SimpleICSGenerator implements ICSGenerator {
    
    private helper: TimeHelper;
    
    constructor(helper: TimeHelper) {
        this.helper = helper;
    }
    
    Create(event: TimetableEvent[]): Blob {
        const cal = ical();
        const calEvents = event.Map(e => this.MapToICS(e))
                               .Flatten<ICalEventData>();
        for (let calEvent of calEvents) {
            cal.createEvent(calEvent);
        }
        return cal.toBlob();
    }
    
    MapToICS(event: TimetableEvent): ICalEventData[] {
        
        const self = this;
        
        function toJSDate(week: number, day: DayOfWeek): (time: LocalTime) => Date {
            return function (time: LocalTime): Date {
                const milli = self.helper.GetDay(week, day, time)
                                  .toInstant()
                                  .toEpochMilli();
                return new Date(milli);
            }
        }
        
        const ses = event.session;
        const course = event.course;
        return event.session.Weeks.Map(x => {
            const genDay = toJSDate(x, ses.Day);
            const start = genDay(ses.StartTime);
            const end = genDay(ses.EndTime);
            return {
                start,
                end,
                summary: `${course.Code} ${ses.Type}`,
                description: `🔢 Code: ${course.Code}
🏷 Name: ${course.Name}
🏠 Type: ${ses.Type}
🏘 Group: ${ses.Group}
✨ AU: ${course.AU}`,
                location: ses.Location,
                busystatus: ICalEventBusyStatus.BUSY,
            }
        });
    }
    
    
}


export {SimpleICSGenerator}
