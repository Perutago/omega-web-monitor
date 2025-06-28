# Omega WEB Monitor
[English](https://github.com/Perutago/omega-web-monitor/blob/main/README.md)
[日本語](https://github.com/Perutago/omega-web-monitor/blob/main/README-ja.md)

## Overview
**Omega WEB Monitor** is an application that monitors changes to websites and sends a Slack notification when it detects a change in the content. **Omega WEB Monitor** can only monitor static content. It cannot monitor websites that require a login or content that is loaded by JavaScript. Docker is required to run **Omega WEB Monitor**.

## Usage

### Download
Clone this repository or download it as a ZIP file.

### ./omega-web-monitor/config/default.json
First, you need to configure the application.
```
{
    // Set the language. Supported languages are "en" and "ja-JP".
    "locale": "en",

    "localesDirectory": "./dist/app/locales",

    // Set the time zone. Refer to the following site for the input format.
    // https://github.com/moment/luxon/blob/master/docs/zones.md#specifying-a-zone
    "timeZone": "system"
}
```

### ./omega-web-monitor/settings/JobSetting.json
Configure the settings for monitoring websites.
```
[
    {
        // Set the UUID for the job. It must not be duplicated with other jobs.
        "id": "00000000-0000-0000-0000-000000000000",

        // Set the name of the job.
        "name": "Omega WEB Monitor star count",

        "type": "xpath",

        // Set the time to execute the job in cron format.
        // https://www.npmjs.com/package/cron
        "cronTime": "0 0 20 * * *",

        // Set the URL of the WEB site to be monitored.
        "url": "https://github.com/Perutago/omega-web-monitor",

        "enabled": true,

        // Set the ID of the notification setting.
        "notificationSettingIds": [
            "00000000-0000-0000-0000-000000000000",
            "00000000-0000-0000-0000-000000000001"
        ],

        // Set the XPath of the monitoring target. You can get the XPath using the developer tools of Chrome.
        "xpath": "/html/body/div[1]/div[5]/div/main/div/div[1]/div[2]/ul/li[3]/div/div[1]/form/button/span[2]/text()"
    }
]
```

### ./omega-web-monitor/settings/NotificationSetting.json
This is the setting for notification when a change is detected in a WEB site.
```
[
    {
        // Set the UUID for the notification setting. It must not be duplicated with other notification settings.
        "id": "00000000-0000-0000-0000-000000000000",

        // Set the name of the notification setting.
        "name": "Sample Notification",

        "type": "slack",

        // Set the Slack webhook.
        "webhookUrl": "https://hooks.slack.com/services/ABCDEFGHI/ABCDEFGHIJK/012345678901234567890123",

        // Set the issuer of the notification.
        "author": "Omega WEB Monitor"
    }
]
```

### Execution
Execute the following command:
```
docker compose up -d
```
