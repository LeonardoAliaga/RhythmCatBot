const { clientIdDc, guildIdDc, tokenDc } = require("./base/config.json");

const discordClient = require('./Discord/DiscordClient')
const { whatsappClient } = require("./Whatsapp/WhatsappClient");

whatsappClient.initialize();
discordClient.login(tokenDc);