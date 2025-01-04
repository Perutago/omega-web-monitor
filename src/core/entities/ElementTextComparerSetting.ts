import { Duration } from 'date-fns';

import JobSetting from './JobSetting';
import { allJobSettingTypes } from '../Types';

export default class ElementTextComparerSetting extends JobSetting {
    static type = allJobSettingTypes[0];

    constructor(public id: string, public name: string, public duration: Duration, public url: string, public enabled: boolean, public xpath: string) {
        super(id, name, ElementTextComparerSetting.type, duration, url, enabled);
    }
}
