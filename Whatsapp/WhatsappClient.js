const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

const qrcode = require("qrcode-terminal");
const color = require("ansi-colors");


const whatsappClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

whatsappClient.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

whatsappClient.on("ready", async () => {
  console.log(
    `${color.cyan("RhythmCat")} esta listo en ${color.green("Whatsapp")} `
  );
  sendMessage("51928750742@c.us", "PanquiBot esta listo carck!");
});

whatsappClient.on("auth_failure", (error) => {
  console.error(error);
});

whatsappClient.on("message", (message) => {
  // Maneja los mensajes de WhatsApp
  // ...
});

const sendMessage = (to, message) => {
  whatsappClient.sendMessage(to, `${message}\n\n_RhythmCatBot_`);
};
const sendMedia = (to, file) => {
  const mediaFile = MessageMedia.fromFilePath(`./Discord/Sources/${file}.mp3`);
  whatsappClient.sendMessage(to, mediaFile);
};

module.exports = {
  whatsappClient,
  sendMessage,
  sendMedia
};