import ElementTextFetcher from './ElementTextFetcher';
import IFetcher from './IFetcher';
import RegexFetcher from './RegexFetcher';
import ElementTextComparerSetting from '../entities/ElementTextComparerSetting';
import JobSetting from '../entities/JobSetting';
import RegexComparerSetting from '../entities/RegexComparerSetting';

export default class FetcherFactory {
    static get(jobSetting: JobSetting): IFetcher {
        if (jobSetting instanceof ElementTextComparerSetting) {
            return new ElementTextFetcher(jobSetting);
        } else if (jobSetting instanceof RegexComparerSetting) {
            return new RegexFetcher(jobSetting);
        } else {
            throw new Error(i18n.__('Error.InvalidJobSetting'));
        }
    }
}
