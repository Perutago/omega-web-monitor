import JobSetting from './JobSetting';
import { allJobSettingTypes } from '../Types';

export default class XpathJobSetting extends JobSetting {
    static type = allJobSettingTypes[0];

    constructor(public id: string, public name: string, public cronTime: string, public url: string, public enabled: boolean, public xpath: string) {
        super(id, name, XpathJobSetting.type, cronTime, url, enabled);
    }
}
