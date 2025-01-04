import { Duration } from 'date-fns';

export default class JobSetting {
    constructor(public id: string, public name: string, public type: string, public duration: Duration, public url: string, public enabled: boolean) {
    }
}
