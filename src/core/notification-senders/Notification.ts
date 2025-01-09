import { ResultType } from "../Types";

export default class Notification {
    private constructor(public type: ResultType, public title: string, public url: string, public message: string) {
    }

    static error(title: string, url: string, message: string): Notification {
        return new Notification(ResultType.ERROR, title, url, message);
    }

    static warning(title: string, url: string, message: string): Notification {
        return new Notification(ResultType.WARNING, title, url, message);
    }

    static info(title: string, url: string, message: string): Notification {
        return new Notification(ResultType.INFO, title, url, message);
    }

    static success(title: string, url: string, message: string): Notification {
        return new Notification(ResultType.SUCCESS, title, url, message);
    }
}
