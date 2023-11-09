const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Reproduce una musica")
    .addStringOption((option) =>
      option
        .setName("nombre")
        .setDescription("Introduce el nombre de la musica")
        .setRequired(true)
    ),
  async execute(interaction, distube) {
    const song = interaction.options.getString("nombre");
    const voiceChannel = interaction.member.voice.channel; //message.member?.voice?.channel;
    const search = await distube.search(song);

      if (!voiceChannel) return await interaction.reply(`Tienes que estar en un canal de voz.`);
    if (
      song.includes("https://www.youtube.com/watch?v=" || "https://youtu.be/")
    ) {
      distube.play(voiceChannel, song, {
      interaction,
      textChannel: interaction.channel,
      member: interaction.member,
    });
    //await i.reply(`${i.user} has selected ${selection}!`);
    return await interaction.reply(`reproduciendo ${song}`);
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId("select")
      .setPlaceholder("Selecciona una canción")
      .addOptions(
        search.map(function (item) {
          //console.log(item)
          return new StringSelectMenuOptionBuilder()
            .setLabel(item.name)
            .setValue(`${item.id}|${item.name}`)
            .setDescription(item.uploader.name);
        })
      );

    const row = new ActionRowBuilder().addComponents(select);

    const response = await interaction.reply({
      conntent: `:mag_right: Buscando **${song}**`,
      components: [row],
    });

    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 30_000,
    });

    collector.on("collect", async (interaction) => {
      const selection = interaction.values[0];
      const [id, name] = selection.split('|')
      const url = `https://www.youtube.com/watch?v=${id}`
     distube.play(voiceChannel, url, {
       interaction,
       textChannel: interaction.channel,
       member: interaction.member,
     });
      await interaction.reply(`reproduciendo **${name}**`);
      console.info(`Reproduciendo: ${url} - ${interaction.guild.name}`)
    });

  },
};
