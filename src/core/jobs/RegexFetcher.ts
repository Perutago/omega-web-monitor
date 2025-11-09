import axios from 'axios';
import i18n from 'i18n';

import JobSetting from '../entities/RegexJobSetting';
import IFetcher from './IFetcher';

export default class RegexFetcher implements IFetcher {
    constructor(private setting: JobSetting) {
    }

    async fetch(): Promise<string> {
        const instance = axios.create({
            baseURL: this.setting.url,
            headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36' }
        });
        const response = await instance.get(this.setting.url);
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
