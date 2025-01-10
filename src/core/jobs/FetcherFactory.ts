import i18n from 'i18n';

import XpathFetcher from './XpathFetcher';
import IFetcher from './IFetcher';
import RegexFetcher from './RegexFetcher';
import XpathJobSetting from '../entities/XpathJobSetting';
import JobSetting from '../entities/JobSetting';
import RegexJobSetting from '../entities/RegexJobSetting';

export default class FetcherFactory {
    static get(jobSetting: JobSetting): IFetcher {
        if (jobSetting instanceof XpathJobSetting) {
            return new XpathFetcher(jobSetting);
        } else if (jobSetting instanceof RegexJobSetting) {
            return new RegexFetcher(jobSetting);
        } else {
            throw new Error(i18n.__('Error.InvalidJobSetting'));
        }
    }
}
