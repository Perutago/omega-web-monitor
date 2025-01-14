import axios from 'axios';
import libxmljs from 'libxmljs';
import i18n from 'i18n';

import IFetcher from './IFetcher';
import JobSetting from '../entities/XpathJobSetting';

export default class XpathFetcher implements IFetcher {
    constructor(private setting: JobSetting) {
    }

    async fetch(): Promise<string> {
        const response = await axios.get(this.setting.url);
        if (typeof response.data !== 'string') {
            throw new Error(i18n.__('Error.Unknown'));
        }
        const element = libxmljs.parseHtml(response.data).get(this.setting.xpath);
        if (!element) {
            throw new Error(i18n.__('Error.ElementNotFound'));
        }
        return element
            .toString()
            .replace('\r', '')
            .replace('\n', '')
            .trim();
    }
}
