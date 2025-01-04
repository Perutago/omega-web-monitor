import ElementTextComparerSetting from './ElementTextComparerSetting';
import RegexComparerSetting from './RegexComparerSetting';

export default class JobSettingFactory {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJson(json: any) {
        if (json.type === ElementTextComparerSetting.type) {
            return new ElementTextComparerSetting(json.id, json.name, json.duration, json.url, json.enabled, json.xpath);
        }
        else if (json.type === RegexComparerSetting.type) {
            return new RegexComparerSetting(json.id, json.name, json.duration, json.url, json.enabled, json.regex);
        }
        else {
            throw new Error(i18n.__('Error.InvalidJobSetting'));
        }
    }
}
