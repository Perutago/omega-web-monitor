export default class JobSetting {
    constructor(public id: string, public name: string, public type: string, public cronTime: string, public url: string, public enabled: boolean) {
    }
}
