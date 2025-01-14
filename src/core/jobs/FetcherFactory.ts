import i18n from 'i18n';

import XpathFetcher from './XpathFetcher';
import IFetcher from './IFetcher';
import RegexFetcher from './RegexFetcher';
import XpathJobSetting from '../entities/XpathJobSetting';
import JobSetting from '../entities/JobSetting';
import RegexJobSetting from '../entities/RegexJobSetting';
import { JobSettingType } from '../Types';

export default class FetcherFactory {
    static get(jobSetting: JobSetting): IFetcher {
        if (jobSetting.type === JobSettingType.XPATH) {
            return new XpathFetcher(jobSetting as XpathJobSetting);
        } else if (jobSetting.type === JobSettingType.REGEX) {
            return new RegexFetcher(jobSetting as RegexJobSetting);
        } else {
            throw new Error(i18n.__('Error.InvalidJobSetting'));
        }
    }
}
