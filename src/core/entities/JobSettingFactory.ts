import XpathJobSetting from './XpathJobSetting';
import RegexJobSetting from './RegexJobSetting';

export default class JobSettingFactory {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJson(json: any) {
        if (json.type === XpathJobSetting.type) {
            return new XpathJobSetting(json.id, json.name, json.duration, json.url, json.enabled, json.xpath);
        }
        else if (json.type === RegexJobSetting.type) {
            return new RegexJobSetting(json.id, json.name, json.duration, json.url, json.enabled, json.regex);
        }
        else {
            throw new Error(i18n.__('Error.InvalidJobSetting'));
        }
    }
}
