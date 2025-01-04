import { Duration } from 'date-fns';

import JobSetting from './JobSetting';
import { allJobSettingTypes } from '../Types';
import ElementTextComparerSetting from './ElementTextComparerSetting';

export default class RegexComparerSetting extends JobSetting {
    static type = allJobSettingTypes[1];

    constructor(public id: string, public name: string, public duration: Duration, public url: string, public enabled: boolean, public regex: string) {
        super(id, name, ElementTextComparerSetting.type, duration, url, enabled);
    }
}
