import IJobSetting, { JobSettingId, JobSettingType } from './IJobSetting';

export default class RegexJobSetting implements IJobSetting {
    public readonly type = JobSettingType.REGEX;

    constructor(public id: JobSettingId, public name: string, public cronTime: string, public url: string, public enabled: boolean, public regex: string) {
    }
}
