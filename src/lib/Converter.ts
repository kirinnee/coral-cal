import {Course, Session, SessionRaw, TimetableEvent, TimetableEventRaw} from "./TimetableEvent";
import {Core, SortType} from "@kirinnee/core";

interface Converter {
    Convert(input: string): TimetableEventRaw
    
    Parse(raw: string): string[];
}

class RealConverter implements Converter {
    
    private core: Core;
    constructor(core: Core) {
        this.core = core;
        this.core.AssertExtend();
    }
    
    parseTime(input: string): [string, string] {
        return input.split("-") as [string,string];
    }
    
    parseWeek(input: string): number[] {
        input = input.Remove("Teaching Wk")
        const sections = input.split(",");
        let ret: number[] = [];
        for(const s of sections) {
            if(s.includes("-")) {
                const [start,end] = s.split("-");
                const [st, ed] = [start.ToInt(), end.ToInt()];
                const weeks = [].Fill(ed -st  + 1, (i) => st + i );
                ret = ret.Add(weeks);
            }else {
                ret.push(s.ToInt());
            }
        }
        return ret.Unique().Sort(SortType.Ascending);
    }
    
    Convert(input: string): TimetableEventRaw {
        let tabs = input
            .ReplaceAll("(Teaching Wk.*)\n", "$1\t\n", true)
            .LineBreak()
            .join(" ")
            
            .split("\t");
        const course: Course = {
            Code: tabs[0],
            Name: tabs[1],
            AU: parseInt(tabs[2]),
            CourseType: tabs[3],
            CourseGroup: tabs[4],
            SUOption: tabs[5],
            Index: parseInt(tabs[6]),
            Status: tabs[7],
        };
        
        tabs = tabs.Skip(9);
        const chunkSize = 6;
        
        const sessions = [];
        for (let i = 0; i < tabs.length; i += chunkSize) {
            const chunk = tabs.slice(i, i + chunkSize);
            
            const [start,end] = this.parseTime(chunk[3]);
            const weeks = this.parseWeek(chunk[5]);
            const session: SessionRaw = {
                Type: chunk[0].trim(),
                Group: chunk[1],
                Day: chunk[2],
                StartTime: start,
                EndTime: end,
                Location: chunk[4],
                Weeks: weeks,
            };
            sessions.push(session);
        }
       
        return {
            course,
            sessions,
        };
    }
    
    Parse(raw: string): string[] {
        const lines = raw.LineBreak();
        
        const courses:string[] = [];
        for(let line of lines) {
            const inspect = line.split("\t");
            if(inspect[0].IsAlphanumeric() && inspect[2].Match(/\d+/) && inspect.length > 5) {
                courses.push(line + "\n");
            } else {
                courses[courses.length - 1] = courses.Last()  + line + "\n";
            }
        }
        return courses.TrimAll();
    }
}
export {
    RealConverter,
}
export type {Converter}
