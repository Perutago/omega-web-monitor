import i18n from 'i18n';

import IJobSetting, { JobSettingType } from '../entities/IJobSetting';
import RegexJobSetting from '../entities/RegexJobSetting';
import XpathJobSetting from '../entities/XpathJobSetting';
import IFetcher from './IFetcher';
import RegexFetcher from './RegexFetcher';
import XpathFetcher from './XpathFetcher';

export default class FetcherFactory {
    static get(jobSetting: IJobSetting): IFetcher {
        if (jobSetting.type === JobSettingType.XPATH) {
            return new XpathFetcher(jobSetting as XpathJobSetting);
        } else if (jobSetting.type === JobSettingType.REGEX) {
            return new RegexFetcher(jobSetting as RegexJobSetting);
        } else {
            throw new Error(i18n.__('Error.InvalidJobSetting'));
        }
    }
}
