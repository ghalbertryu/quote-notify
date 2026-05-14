# Daily Telegram Boost

GitHub Actions sends one Traditional Chinese encouragement message to Telegram every day at 09:00 Asia/Taipei.

The sentence library lives in `data/boost-messages.json`. Update it by instruction: tell Codex what tone, theme, or new sentences you want, then Codex edits the JSON and you push the change to GitHub.

## Setup

1. Create a Telegram bot with [@BotFather](https://t.me/BotFather), then copy the bot token.
2. Send any message to your bot from your Telegram account.
3. Open this URL in a browser, replacing `<BOT_TOKEN>`:

   ```text
   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
   ```

4. Find your `chat.id` in the JSON response.
5. Add these GitHub repository secrets under `Settings -> Secrets and variables -> Actions -> Repository secrets`:

   ```text
   TELEGRAM_BOT_TOKEN
   TELEGRAM_CHAT_ID
   ```

6. Push this repository to GitHub.
7. In the `Actions` tab, run `Daily Telegram Boost` manually once with `workflow_dispatch` to verify delivery.

## Troubleshooting

If Telegram returns `Bad Request: chat not found`, check these items:

- Send `/start` or any message to the bot from the Telegram account that should receive notifications.
- Open `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates` after sending that message.
- Use the value at `message.chat.id` as `TELEGRAM_CHAT_ID`.
- For groups, add the bot to the group first, send a message in the group, then use the group chat id from `getUpdates`. Group ids are often negative numbers.
- For channels, add the bot as an admin and use the channel chat id or public `@channel_username`.

The daily Telegram scheduled run uses UTC cron:

```text
0 1 * * *
```

That is 09:00 in Asia/Taipei.
