import { NotificationSettingType } from "../Types";

export default class NotificationSetting {
    constructor(public id: string, public name: string, public type: NotificationSettingType) {
    }
}
