import bodyParser from 'body-parser';
import config from 'config';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import listEndpoints from 'express-list-endpoints';
import helmet from 'helmet';
import i18n from 'i18n';
import cron from 'node-cron';

import job from './routes/job/index';
import jobSetting from './routes/job-setting/index';
import notificationSetting from './routes/notification-setting/index';
import JobFactory from '../core/jobs/JobFactory';
import JobSettingRepository from '../core/repositories/JsonJobSettingRepository';
import NotificationSettingRepository from '../core/repositories/JsonNotificationSettingRepository';

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const rootUrl = '/omega-web-monitor/api/v1/';
app.use(`${rootUrl}job`, job);
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
cron.schedule(config.get('schedule'), () => {
    doSchedule();
});

async function doSchedule() {
    const notificationSettingRepository = new NotificationSettingRepository();
    const notificationSettings = await notificationSettingRepository.readAll();
    const jobSettingRepository = new JobSettingRepository();
    const jobSettings = await jobSettingRepository.readAll();
    jobSettings.forEach(jobSetting => {
        const job = JobFactory.get(notificationSettings, jobSetting);
        job.run();
    });
    return Promise.resolve();
}

function logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    next(err);
}

function clientErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    } else {
        next(err);
    }
}

function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
    res.status(500);
    res.render('error', { error: err });
}
