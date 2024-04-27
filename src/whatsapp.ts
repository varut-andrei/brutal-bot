import { Client } from "whatsapp-web.js";
import QrCode from "qrcode-terminal";
import { getLowestPrice, run } from "./brutal.ts";
import { BRUTALIST, ieftin, URL } from "./constants.ts";

import { startPrompt } from "./prompt.ts";

const client = new Client({
  webVersionCache: {
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    type: "remote",
  },
});

let qrCode: string;
const drawQr = (qr: string) => {
  QrCode.generate(qr, { small: true });
  console.log(`QR link: ${qr}\n`);
};

const info = async () => {
  const getBatteryStatus = await client.info.getBatteryStatus();
  const platform = client.info.platform;
  const pushname = client.info.pushname;
  const wid = client.info.wid;

  console.log({ getBatteryStatus, platform, pushname, wid });
};
const getPrice = async () => {
  const lowestPrice = await getLowestPrice();
  if (!lowestPrice) {
    console.log(`No price found!`);
    return;
  }

  console.log(`› Lowest price: ${lowestPrice.price}€`);
};
const sendMessage = async () => {
  const lowestPrice = await getLowestPrice();
  if (!lowestPrice) {
    console.log(`No price found!`);
    return;
  }

  const msg = `nala bilet cu ${lowestPrice.price} de galbeni \n la ${URL}`;
  await client.sendMessage(BRUTALIST, msg);
};

const clear = async () => {
  console.clear();
  drawQr(qrCode);
};

client.on("authenticated", () => {
  console.log("Authenticated!");
  run();
  startPrompt({ info, getPrice, sendMessage, clear });
});

client.on("disconnected", () => {
  console.log("Disconnected!");
});

client.on("ready", () => {
  console.log("WhatsApp client is ready!");
});

client.on("qr", (qr) => {
  qrCode = qr;
  drawQr(qr);
});

client.on("message", async (message) => {
  const chat = await message.getChat();

  if (chat.id._serialized === BRUTALIST && message.body === "!pret") {
    const lowestPrice = await getLowestPrice();
    const msg = lowestPrice
      ? ieftin(lowestPrice.price)
      : "baiatu' n-am bilete RIP";

    await client.sendMessage(BRUTALIST, msg);
  }
});

export { client };
