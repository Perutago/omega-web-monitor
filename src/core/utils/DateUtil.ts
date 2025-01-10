import { format } from 'date-fns';

export default class DateUtil {
    static format(date: Date, formatString: string) {
        return format(date, formatString);
    }

    static formatDefault(date: Date) {
        return DateUtil.format(date, 'yyyy/MM/dd HH:mm:ss');
    }
}
