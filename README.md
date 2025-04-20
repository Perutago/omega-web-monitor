# Omega WEB Monitor
[English](https://github.com/Perutago/omega-web-monitor/blob/main/README.md)
[日本語](https://github.com/Perutago/omega-web-monitor/blob/main/README-ja.md)

## Overview
**Omega WEB Monitor** is an application that monitors changes to websites and sends notifications to Slack when content changes are detected. **Omega WEB Monitor** is limited to monitoring static content. It cannot monitor websites that require login or content loaded dynamically via JavaScript. Docker is required to run **Omega WEB Monitor**.

## Usage

### Download
Clone the repository using `git clone` or download it as a ZIP file.

### ./omega-web-monitor/config/default.json
First, configure the general application settings.
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
        // Set the UUID for the job. This must be unique.
        "id": "00000000-0000-0000-0000-000000000000",

        // Set the job name.
        "name": "Omega WEB Monitor star count",

        "type": "xpath",

        // Set the job execution time in cron format.
        // https://www.npmjs.com/package/cron
        "cronTime": "0 0 20 * * *",

        // Set the URL of the website to monitor.
        "url": "https://github.com/Perutago/omega-web-monitor",

        "enabled": true,

        // Set the XPath expression to monitor. You can obtain the XPath using your browser's developer tools.
        "xpath": "/html/body/div[1]/div[5]/div/main/div/div[1]/div[2]/ul/li[3]/div/div[1]/form/button/span[2]/text()"
    }
]
```

### ./omega-web-monitor/settings/NotificationSetting.json
Configure the notification settings for website changes.
```
[
    {
        // Set the UUID for the notification setting. This must be unique.
        "id": "00000000-0000-0000-0000-000000000000",

        // Set the name of the notification setting.
        "name": "Sample Notification",

        "type": "slack",

        // Set the Slack webhook URL.
        "webhookUrl": "https://hooks.slack.com/services/ABCDEFGHI/ABCDEFGHIJK/012345678901234567890123",

        // Set the author of the notification.
        "author": "Omega WEB Monitor"
    }
]
```

### Execution
Run the following command:
```
docker compose up -d
```
