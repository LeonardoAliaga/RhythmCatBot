const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const { sendMessage, sendMedia } = require("../../../Whatsapp/WhatsappClient.js");
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const { default: ffmpegPath } = require("ffmpeg-static");

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
  ffmpegPath: ffmpegPath, // FFmpeg binary location
  outputPath: '/home/aliagaleonardo23/RhythmCatBot/Discord/Sources', // Output file location (default: the home directory)
  youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
  queueParallelism: 2, // Download parallelism (default: 1)
  progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
  allowWebm: false, // Enable download from WebM sources (default: false)
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("musica")
    .setDescription("te gusta la musica")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reproducir")
        .setDescription("Reproduce una musica a tu gusto")
        .addStringOption((option) =>
          option
            .setName("musica")
            .setRequired(true)
            .setDescription("Escribe el nombre de la musica a reproducir")
            .setMaxLength(2_000)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("descargar")
        .setDescription("Descargamos y enviamos la musica a tu whatsapp")
        .addNumberOption((option) =>
          option
            .setName("numero")
            .setRequired(true)
            .setDescription("Escribe el número de celular a enviar")
        )
    ),
  async execute(interaction, distube) {
    if (interaction.options.getSubcommand() === "descargar") {
      const numero = interaction.options.getNumber("numero");
      const queue = distube.getQueue(interaction);
      await interaction.reply({content: `Descargando **${queue.songs[0].name}** \`espere porfavor.\``, ephemeral: true})
      YD.download(queue.songs[0].id);
      YD.on("finished", async function (err, data) {
        sendMedia(`51${numero}@c.us`, data.videoTitle)
        sendMessage(`51${numero}@c.us`, data.youtubeUrl);
        return await interaction.editReply({
          content: `Se ah enviado **${data.videoTitle}** correctamente a \`${numero}\``, ephemeral: true
        });
      });
      //sendMessage(numero, "xd")
    } else if (interaction.options.getSubcommand() === "reproducir") {
      const song = interaction.options.getString("musica");
        const voiceChannel = interaction.member.voice.channel; //message.member?.voice?.channel;
        const search = await distube.search(song);
        if (!voiceChannel)
          return await interaction.reply(`Tienes que estar en un canal de voz.`);
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
          ephemeral: true
        });
        const collector = response.createMessageComponentCollector({
          componentType: ComponentType.StringSelect,
          time: 30_000,
        });
        collector.on("collect", async (interaction) => {
          const selection = interaction.values[0];
          const [id, name] = selection.split("|");
          const url = `https://www.youtube.com/watch?v=${id}`;
          distube.play(voiceChannel, url, {
            interaction,
            textChannel: interaction.channel,
            member: interaction.member,
          });
          await interaction.reply({ content: `reproduciendo **${name}**`, ephemeral: true });
          console.info(`Reproduciendo: ${url} - ${interaction.guild.name}`);
        });
    }
  },
};
