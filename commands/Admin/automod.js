const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Configura el sistema de moderación automatica")
    .addSubcommand((command) =>
      command
        .setName("flagged-words")
        .setDescription("Block profanity, sexual content, and slurs")
    )
    .addSubcommand((command) =>
      command
        .setName("spam-messages")
        .setDescription("Block messages suspected of spam")
    )
    .addSubcommand((command) =>
      command
        .setName("mention-spam")
        .setDescription(
          "Block messages containing a certain amount of mentions"
        )
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription(
              "The number of mentions required to block a message"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("keyword")
        .setDescription("Block a given keyword in the server")
        .addStringOption((option) =>
          option
            .setName("word")
            .setDescription("The word you want to block")
            .setRequired(true)
        )
    ),
    async execute(interaction) {
        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'No tienes el permiso necesario para iniciar el proceso de moderacion', ephemeral: true });
        
        switch (sub) {
          case "flagged-words":
            await interaction.reply({ content: "Loading" });
            const rule = await guild.autoModerationRules
              .create({
                name: "Block profanity, sexual content, and slurs by tutorial bot",
                creatorId: "728259605565800558",
                enabled: true,
                eventType: 1,
                triggerType: 4,
                triggerMetadata: {
                  presets: [1, 2, 3],
                },
                actions: [
                  {
                    type: 1,
                    metadata: {
                      channel: interaction.channel,
                      durationSeconds: 10,
                      custommessage: "este es un mensaje de prueba",
                    },
                  },
                ],
              })
              .catch(async (error) => {
                setTimeout(async () => {
                  console.log(error);
                  await interaction.editReply({ content: `${error}` });
                }, 2000);
              });

            setTimeout(async () => {
              if (!rule) return;
              const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("el autorol esta creado");

              await interaction.editReply({ content: ``, embed: [embed] });
            }, 3000);

            break;

          case "keyword":
            await interaction.reply({ content: "Loading" });
            const word = options.getString("word");

            const rule2 = await guild.autoModerationRules
              .create({
                name: `Prevenir la palabra ${word}`,
                creatorId: "728259605565800558",
                enabled: true,
                eventType: 1,
                triggerType: 1,
                triggerMetadata: {
                  keywordFilter: [`${word}`],
                },
                actions: [
                  {
                    type: 1,
                    metadata: {
                      channel: interaction.channel,
                      durationSeconds: 10,
                      custommessage: "este es un mensaje de prueba",
                    },
                  },
                ],
              })
              .catch(async (error) => {
                setTimeout(async () => {
                  console.log(error);
                  await interaction.editReply({ content: `${error}` });
                }, 2000);
              });

            setTimeout(async () => {
              if (!rule2) return;
              const embed2 = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(
                  "todas las palabras escogidas serán eliminadas"
                );

              await interaction.editReply({ content: ``, embeds: [embed2] });
            }, 3000);

            break;

          case "spam-messages":
            await interaction.reply({ content: "Loading" });

            const rule3 = await guild.autoModerationRules
              .create({
                name: "prevenir mensajes de spam",
                creatorId: "728259605565800558",
                enabled: true,
                eventType: 1,
                triggerType: 5,
                triggerMetadata: {
                  //mentionTotalLimit: number,
                },
                actions: [
                  {
                    type: 1,
                    metadata: {
                      channel: interaction.channel,
                      durationSeconds: 10,
                      custommessage: "este es un mensaje de prueba",
                    },
                  },
                ],
              })
              .catch(async (error) => {
                setTimeout(async () => {
                  console.log(error);
                  await interaction.editReply({ content: `${error}` });
                }, 2000);
              });

            setTimeout(async () => {
              if (!rule3) return;
              const embed3 = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("el autorol esta creado");

              await interaction.editReply({ content: ``, embeds: [embed3] });
            }, 3000);

            break;
          case "mention-spam":
            await interaction.reply({ content: "Loading" });
            const number = options.getInteger("number");

            const rule4 = await guild.autoModerationRules
              .create({
                name: "prevenir mensajes de spam",
                creatorId: "728259605565800558",
                enabled: true,
                eventType: 1,
                triggerType: 5,
                triggerMetadata: {
                  mentionTotalLimit: number,
                },
                actions: [
                  {
                    type: 1,
                    metadata: {
                      channel: interaction.channel,
                      durationSeconds: 10,
                      custommessage: "este es un mensaje de prueba",
                    },
                  },
                ],
              })
              .catch(async (error) => {
                setTimeout(async () => {
                  console.log(error);
                  await interaction.editReply({ content: `${error}` });
                }, 2000);
              });

            setTimeout(async () => {
              if (!rule4) return;
              const embed4 = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("el autorol esta creado");

              await interaction.editReply({ content: ``, embeds: [embed4] });
            }, 3000);

            break;
        }
  },
};
