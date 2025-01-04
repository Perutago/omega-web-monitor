import axios from 'axios';
import libxmljs from 'libxmljs';

import IFetcher from './IFetcher';
import JobSetting from '../entities/ElementTextComparerSetting';

export default class ElementTextFetcher implements IFetcher {
    constructor(private setting: JobSetting) {
    }

    async fetch(): Promise<string> {
        const response = await axios.get(this.setting.url);
        if (typeof response.data !== 'string') {
            throw new Error(i18n.__('Error.Unknown'));
        }
        const element = libxmljs.parseHtmlString(response.data).get(this.setting.xpath);
        if (!element) {
            throw new Error(i18n.__('Error.ElementNotFound'));
        }
        return element
            .text()
            .replace('\r', '')
            .replace('\n', '')
            .trim();
    }
}
