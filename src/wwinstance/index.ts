// initiate whatsapp web instance
import qrcode from "qrcode-terminal";
import { Client, LocalAuth } from "whatsapp-web.js";
const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "-disable-setuid-sandbox"],
  },
  qrMaxRetries: 5,
  authStrategy: new LocalAuth({ clientId: "client-one" }),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("[BOOT] Client is ready!");
});
client.on("message", async (message) => {
  if (message.from === "258822487710@c.us" && message.hasMedia === true) {
    const media = await message.downloadMedia();
    if (media) {
      await client
        .sendMessage(message.from, media, {
          sendMediaAsSticker: true,
        })
        .then(() => {
          console.log(`[INFO] Sticker sent to ${message.from}`);
        });
    }
  }
});
client.on("authenticated", (session) => {
  console.log("[BOOT] Client is authenticated!");
});

export const initializeInstance = () => {
  console.log("[BOOT] Client is being initialized");
  client.initialize();
};
