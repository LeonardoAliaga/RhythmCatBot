const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  async execute(c) {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  console.log(
    `Cliente listo para el servidor: ${
      c.guilds.cache.get("1171148610705031279").name
    }`
  );
  },
};
