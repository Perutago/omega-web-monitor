import axios from 'axios';
import i18n from 'i18n';

import JobSetting from '../entities/RegexJobSetting';
import IFetcher from './IFetcher';

export default class RegexFetcher implements IFetcher {
    constructor(private setting: JobSetting) {
    }

    async fetch(): Promise<string> {
        const response = await axios.get(this.setting.url);
        if (typeof response.data !== 'string') {
            throw new Error(i18n.__('Error.Unknown'));
        }
        const resultTexts = response.data.match(this.setting.regex);
        if (!resultTexts) {
            throw new Error(i18n.__('Error.RegexNotMatched', this.setting.regex));
        }
        return resultTexts
            .join()
            .replace('\r', '')
            .replace('\n', '')
            .trim();
    }
}
