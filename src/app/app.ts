import bodyParser from 'body-parser';
import config from 'config';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import listEndpoints from 'express-list-endpoints';
import helmet from 'helmet';
import i18n from 'i18n';
import Job from '../core/jobs/Job';
import { ResultType } from '../core/Types';
import JobSettingWatcher from './JobSettingWatcher';
import jobResult from './routes/job-result/index';
import jobSetting from './routes/job-setting/index';
import job from './routes/job/index';
import notificationSetting from './routes/notification-setting/index';

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const rootUrl = '/omega-web-monitor/api/v1/';
app.use(`${rootUrl}job`, job);
app.use(`${rootUrl}job-result`, jobResult);
app.use(`${rootUrl}job-setting`, jobSetting);
app.use(`${rootUrl}notification-setting`, notificationSetting);
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('listen on port ' + port);
    console.log(listEndpoints(app));
});

i18n.configure({
    locales: ['en', 'ja-JP'],
    directory: config.get('localesDirectory'),
    updateFiles: false,
});
i18n.setLocale(config.get('locale'));

const watcher = new JobSettingWatcher(async jobSetting => {
    const job = new Job(jobSetting);
    job.run();
});
watcher.loadJobSetting();

function logErrors(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.error(err.stack);
    next(err);
}

function clientErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    } else {
        next(err);
    }
}

function errorHandler(err: Error, req: Request, res: Response): void {
    res.status(500);
    res.render(ResultType.ERROR, { error: err });
}
