# Omega WEB Monitor
[English](https://github.com/Perutago/omega-web-monitor/blob/main/README.md)
[日本語](https://github.com/Perutago/omega-web-monitor/blob/main/README-ja.md)

## 概要
**Omega WEB Monitor**は、Webサイトの変更を監視し、コンテンツに変更があった場合にSlackへ通知するアプリケーションです。**Omega WEB Monitor**が監視できるのは、静的なコンテンツのみです。ログインが必要なWebサイトや、JavaScriptによって動的に読み込まれるコンテンツは監視できません。**Omega WEB Monitor**の実行には、Dockerが必要です。

## 使い方

### ダウンロード
`git clone`コマンドを実行するか、ZIP形式でダウンロードしてください。

### ./omega-web-monitor/config/default.json
はじめに、アプリケーション全体の設定を行います。
```
{
    // 言語を設定します。対応している言語は「en」と「ja-JP」です。
    "locale": "en",

    "localesDirectory": "./dist/app/locales",

    // タイムゾーンを設定します。入力フォーマットについては、以下のサイトを参照してください。
    // https://github.com/moment/luxon/blob/master/docs/zones.md#specifying-a-zone
    "timeZone": "system"
}
```

### ./omega-web-monitor/settings/JobSetting.json
Webサイトを監視するための設定を行います。
```
[
    {
        // 実行するジョブのUUIDを設定します。他のジョブのUUIDと重複しないようにしてください。
        "id": "00000000-0000-0000-0000-000000000000",

        // ジョブの名称を設定します。
        "name": "Omega WEB Monitorのスターの数",

        "type": "xpath",

        // ジョブを実行する時刻をcron形式で設定します。
        // https://www.npmjs.com/package/cron
        "cronTime": "0 0 20 * * *",

        // 監視するWebサイトのURLを設定します。
        "url": "https://github.com/Perutago/omega-web-monitor",

        "enabled": true,

        // 通知設定のIDを設定します。
        "notificationSettingIds": [
            "00000000-0000-0000-0000-000000000000",
            "00000000-0000-0000-0000-000000000001"
        ],

        // 監視対象のXPathを設定します。XPathは、Chromeのデベロッパーツールで取得できます。
        "xpath": "/html/body/div[1]/div[5]/div/main/div/div[1]/div[2]/ul/li[3]/div/div[1]/form/button/span[2]/text()"
    }
]
```

### ./omega-web-monitor/settings/NotificationSetting.json
Webサイトの変更を検知した場合の通知設定を行います。
```
[
    {
        // 通知設定のUUIDを設定します。他の通知設定のUUIDと重複しないようにしてください。
        "id": "00000000-0000-0000-0000-000000000000",

        // 通知設定の名称を設定します。
        "name": "Sample Notification",

        "type": "slack",

        // SlackのWebhook URLを設定します。
        "webhookUrl": "https://hooks.slack.com/services/ABCDEFGHI/ABCDEFGHIJK/012345678901234567890123",

        // 通知の送信者を設定します。
        "author": "Omega WEB Monitor"
    }
]
```

### 実行
以下のコマンドを実行してください。
```
docker compose up -d
```