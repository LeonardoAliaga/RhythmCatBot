const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
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

        if (!voiceChannel)
            return await interaction.reply(`Tienes que estar en un canal de voz.`);
      
        const select = new StringSelectMenuBuilder()
            .setCustomId("select")
            .setPlaceholder("Selecciona una canción")
            .addOptions(
                search.map(function (item) {
                    console.log(item);
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(item.name)
                        .setValue(item.url)
                        .setDescription(item.uploader.name);
                })
            );
      
        const row = new ActionRowBuilder().addComponents(select);
      
        await interaction.reply({
          conntent: `:mag_right: Buscando **${song}**`,
          components: [row],
        });


    //   search.map(function(item) {console.log(item.name)});
    distube.play(voiceChannel, song, {
      interaction,
      textChannel: interaction.channel,
      member: interaction.member,
    });
    //interaction.guild is the object representing the Guild in which the command was run
    //await interaction.reply(`:mag_right: Buscando **${song}**`);
  },
};
