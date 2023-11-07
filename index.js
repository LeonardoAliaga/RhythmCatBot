const {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages] });
const { clientId, guildId, token } = require("./config.json");const fs = require("fs");
const path = require("path");

// Create a new DisTube
const distube = new DisTube(client, {
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
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
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
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

//Event Handler
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, distube));
  } else {
    client.on(event.name, (...args) => event.execute(...args, distube));
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// console.log(client.commands.data)
const commands = client.commands.map((command) => command.data.toJSON());
// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${client.commands.size} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
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



client.login(token);
