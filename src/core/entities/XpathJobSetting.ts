import IJobSetting, { JobSettingId, JobSettingType } from './IJobSetting';

export default class XpathJobSetting implements IJobSetting {
    public readonly type = JobSettingType.XPATH;

    get key(): string {
        return this.id;
    }

    constructor(public id: JobSettingId, public name: string, public cronTime: string, public url: string, public enabled: boolean, public xpath: string) {
    }
}
