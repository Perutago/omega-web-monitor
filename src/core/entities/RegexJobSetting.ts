import { Duration } from 'date-fns';

import JobSetting from './JobSetting';
import { allJobSettingTypes } from '../Types';

export default class RegexJobSetting extends JobSetting {
    static type = allJobSettingTypes[1];

    constructor(public id: string, public name: string, public duration: Duration, public url: string, public enabled: boolean, public regex: string) {
        super(id, name, RegexJobSetting.type, duration, url, enabled);
    }
}
