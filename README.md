# Omega WEB Monitor
[English](https://github.com/Perutago/omega-web-monitor/blob/main/README.md)
[日本語](https://github.com/Perutago/omega-web-monitor/blob/main/README-ja.md)

## Overview
**Omega WEB Monitor** is an application that monitors changes to websites and notifies you via Slack when content changes. **Omega WEB Monitor** can only monitor static content. It cannot monitor websites that require login or content loaded by JavaScript. Docker is required to run **Omega WEB Monitor**.

## Usage

### Download
Please `git clone` or download as a ZIP file.

### ./omega-web-monitor/config/default.json
First, configure the overall application settings.
```
{
    // Set the language. Supported languages are "en" and "ja-JP".
    "locale": "en",

    "localesDirectory": "./dist/app/locales",

    // Set the time zone. For input format, please refer to the following site.
    // https://github.com/moment/luxon/blob/master/docs/zones.md#specifying-a-zone
    "timeZone": "system"
}
```

### ./omega-web-monitor/settings/JobSetting.json
Configure the settings for monitoring websites.
```
[
    {
        // Set the UUID for the job to be executed. It cannot be duplicated with other job UUIDs.
        "id": "00000000-0000-0000-0000-000000000000",

        // Set the name of the job.
        "name": "Number of stars for Omega WEB Monitor",

        "type": "xpath",

        // Set the time to execute the job in cron format.
        // https://www.npmjs.com/package/cron
        "cronTime": "0 0 20 * * *",

        // Set the URL of the website to be monitored.
        "url": "https://github.com/Perutago/omega-web-monitor",

        "enabled": true,

        // Set the XPath of the target to be monitored. XPath can be obtained using Chrome's developer tools.
        "xpath": "/html/body/div[1]/div[5]/div/main/div/div[1]/div[2]/ul/li[3]/div/div[1]/form/button/span[2]/text()"
    }
]
```

### ./omega-web-monitor/settings/NotificationSetting.json
Configure the notification settings for when there are changes to the website.
```
[
    {
        // Set the UUID for the notification setting. It cannot be duplicated with other notification setting UUIDs.
        "id": "00000000-0000-0000-0000-000000000000",

        // Set the name of the notification setting.
        "name": "Sample Notification",

        "type": "slack",

        // Set the Slack webhook.
        "webhookUrl": "https://hooks.slack.com/services/ABCDEFGHI/ABCDEFGHIJK/012345678901234567890123",

        // Set the author of the notification.
        "author": "Omega WEB Monitor"
    }
]
```

### Execution
Please run the following command.
```
docker compose up -d
```
