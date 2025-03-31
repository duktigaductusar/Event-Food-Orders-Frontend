import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";

export function getDateFromNgbTimeAndDateStructs(date?: NgbDateStruct, time?: NgbTimeStruct) {
    if (date == null || time?.hour == null || time?.minute == null) {
        return null;
    }

    return new Date(
        date.year,
        date.month - 1,
        date.day,
        time.hour,
        time.minute,
        time.second
    );
};

export function dateToNgbDateStruct(date: Date | string | undefined | null): NgbDateStruct {
    if (date == null) {
        return {} as NgbDateStruct
    }
    
    const d = typeof date === 'string' ? new Date(date) : date;

    return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
    };
}


export function dateToNgbTimeStruct(date: Date | string | undefined | null): NgbTimeStruct {
    if (date == null) {
        return {} as NgbTimeStruct
    }
    
    const d = typeof date === 'string' ? new Date(date) : date;
    
    return {
        hour: d.getHours(),
        minute: d.getMinutes(),
        second: d.getSeconds(),
    };
}

export function fromDateTimeISOString(isoString: string): Date {
    return new Date(isoString);
}

export function toDateTimeISOStrig(date: NgbDateStruct, time: NgbTimeStruct) {
    return new Date(
        date.year,
        date.month - 1,
        date.day,
        time.hour,
        time.minute,
        time.second
    ).toISOString();
};

export function isLessThanOneDayInFuture(date: Date): boolean {
    const now = new Date();
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return date > now && date < oneDayLater;
}
