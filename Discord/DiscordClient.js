const Discord = require("discord.js");
const { clientIdDc, guildIdDc, tokenDc } = require("../base/config.json");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

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

// Create a new DisTube
const distube = new DisTube(discordClient, {
  searchSongs: 5,
  emitNewSongOnly: true,
  searchCooldown: 30,
  leaveOnEmpty: false,
  leaveOnFinish: false,
  leaveOnStop: false,
  plugins: [
    new SpotifyPlugin({
      parallel: true,
      emitEventsAfterFetching: false,
    }),
  ],
  //youtubeCookie: JSON.stringify(JSON.parse(fs.readFileSync("cookies.json"))),
});


//Command Handler
discordClient.commands = new Discord.Collection();
const foldersPath = path.join(__dirname, "Commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      discordClient.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

//Event Handler
const eventsPath = path.join(__dirname, "Events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    discordClient.once(event.name, (...args) =>
      event.execute(...args, distube)
    );
  } else {
    discordClient.on(event.name, (...args) => event.execute(...args, distube));
  }
}
// Construct and prepare an instance of the REST module
const rest = new Discord.REST().setToken(tokenDc);
// console.log(client.commands.data)
const commands = discordClient.commands.map((command) => command.data.toJSON());
// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${discordClient.commands.size} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Discord.Routes.applicationGuildCommands(clientIdDc, guildIdDc),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();

module.exports = discordClient