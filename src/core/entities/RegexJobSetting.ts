import JobSetting from './JobSetting';
import { allJobSettingTypes } from '../Types';

export default class RegexJobSetting extends JobSetting {
    static type = allJobSettingTypes[1];

    constructor(public id: string, public name: string, public cronTime: string, public url: string, public enabled: boolean, public regex: string) {
        super(id, name, RegexJobSetting.type, cronTime, url, enabled);
    }
}
