const Discord = require("discord.js");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { clientIdDc, guildIdDc, tokenDc } = require("./config.json");

const qrcode = require("qrcode-terminal");
const color = require("ansi-colors");
const fs = require("fs");
const path = require("path");

//Definiendo e iniciando clientes
const discordClient = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.GuildMessages,
  ],
});
const whatsappClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

//Discord propeties
// Construct and prepare an instance of the REST module
const rest = new Discord.REST().setToken(tokenDc);
discordClient.login(tokenDc);

discordClient.on("ready", (client) => {
  console.log(`${color.cyan(client.user.username)} esta listo en ${color.blue(
      "Discord")}`);
  // Maneja los mensajes de Discord
  // ...
});
discordClient.login(tokenDc);

//Whatsapp propeties
whatsappClient.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

whatsappClient.on("ready", async () => {
  console.log(
    `${color.cyan("RhythmCat")} esta listo en ${color.green(
      "Whatsapp")} `
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

whatsappClient.initialize();
 

//Funciones

const sendMessage = (to, message) => {
  whatsappClient.sendMessage(to, `${message}\n\n_PanquiBot_`);
};
