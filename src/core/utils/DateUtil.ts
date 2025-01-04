import { add, Duration, format, formatDuration } from 'date-fns';
import { ja } from 'date-fns/locale';
import i18n from 'i18n';

export default class DateUtil {
    static add(date: Date, duration: Duration) {
        return add(date, duration);
    }

    static format(date: Date, formatString: string) {
        return format(date, formatString);
    }

    static formatDefault(date: Date) {
        return DateUtil.format(date, 'yyyy/MM/dd HH:mm:ss');
    }

    static formatDuration(duration: Duration) {
        return formatDuration(duration, { locale: this.getLocale(i18n.getLocale().substring(0, 2)) });
    }

    static getLocale(localeString: string) {
        if (localeString.startsWith('ja')) {
            return ja;
        } else {
            return undefined;
        }
    }
}
