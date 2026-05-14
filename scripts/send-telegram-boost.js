const https = require("https");
const fs = require("fs");
const path = require("path");

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID.");
  process.exit(1);
}

const messagesPath = path.join(__dirname, "..", "data", "boost-messages.json");
const messages = JSON.parse(fs.readFileSync(messagesPath, "utf8"));

if (!Array.isArray(messages) || messages.length === 0) {
  console.error("data/boost-messages.json must contain at least one message.");
  process.exit(1);
}

const now = new Date();
const taipeiDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Taipei",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(now);

const index = hash(taipeiDate) % messages.length;
const text = messages[index];

sendTelegramMessage(text)
  .then(() => {
    console.log(`Sent daily boost for ${taipeiDate}: ${text}`);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function hash(value) {
  let result = 0;
  for (const char of value) {
    result = (result * 31 + char.charCodeAt(0)) >>> 0;
  }
  return result;
}

function sendTelegramMessage(text) {
  const body = JSON.stringify({
    chat_id: chatId,
    text,
    disable_web_page_preview: true
  });

  const options = {
    hostname: "api.telegram.org",
    path: `/bot${token}/sendMessage`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body)
    }
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(data);
          return;
        }

        reject(
          new Error(
            `Telegram API returned ${response.statusCode}: ${data}`
          )
        );
      });
    });

    request.on("error", reject);
    request.write(body);
    request.end();
  });
}
