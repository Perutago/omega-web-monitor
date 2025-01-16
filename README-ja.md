# Omega WEB Monitor
[English](https://github.com/Perutago/omega-web-monitor/blob/main/README.md)
[日本語](https://github.com/Perutago/omega-web-monitor/blob/main/README-ja.md)

## 概要
**Omega WEB Monitor**はWEBサイトの変更を監視し、コンテンツに変更があったらSlackに通知するアプリケーションです。**Omega WEB Monitor**が監視できるのは静的なコンテンツだけです。ログインを必要とするWEBサイトや、JavaScriptでロードされるコンテンツを監視することはできません。**Omega WEB Monitor**の実行にはDockerが必要です。

## 使い方

### ダウンロード
git cloneするか、またはZIP形式でダウンロードしてください。

### ./omega-web-monitor/config/default.json
まず初めにアプリケーション全体の設定を行います。
```
{
    // 言語を設定してください。対応している言語は「en」「ja-JP」です。
    "locale": "en",

    "localesDirectory": "./dist/app/locales",

    // タイムゾーンを設定してください。入力フォーマットについては以下のサイトを参照してください。
    // https://github.com/moment/luxon/blob/master/docs/zones.md#specifying-a-zone
    "timeZone": "system"
}
```

### ./omega-web-monitor/settings/JobSetting.json
WEBサイトを監視する設定を行います。
```
[
    {
        // 実行するジョブのUUIDを設定してください。他のジョブのUUIDと重複できません。
        "id": "00000000-0000-0000-0000-000000000000",

        // ジョブの名称を設定してください。
        "name": "Omega WEB Monitorのスターの数",

        "type": "xpath",

        // ジョブを実行する時刻をcron形式で設定してください。
        // https://www.npmjs.com/package/cron
        "cronTime": "0 0 20 * * *",

        // 監視するWEBサイトのURLを設定してください。
        "url": "https://github.com/Perutago/omega-web-monitor",

        "enabled": true,

        // 監視対象のXPathを設定してください。XPathはChromeの開発者ツールを使って取得できます。
        "xpath": "/html/body/div[1]/div[5]/div/main/div/div[1]/div[2]/ul/li[3]/div/div[1]/form/button/span[2]/text()"
    }
]
```

### ./omega-web-monitor/settings/NotificationSetting.json
WEBサイトに変更があった場合の通知設定を行います。
```
[
    {
        // 通知設定のUUIDを設定してください。他の通知設定のUUIDと重複できません。
        "id": "00000000-0000-0000-000000000000",

        // 通知設定の名称を設定してください。
        "name": "Sample Notification",

        "type": "slack",

        // SlackのWEBフックを設定してください。
        "webhookUrl": "https://hooks.slack.com/services/ABCDEFGHI/ABCDEFGHIJK/012345678901234567890123"
    }
]
```

### 実行
以下のコマンドを実行してください。
```
docker compose up -d
```
