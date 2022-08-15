const { SlashCommandBuilder, Colors } = require("discord.js");
const Discord = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help command for bot"),
  async execute(interaction) {
    const embed = new Discord.EmbedBuilder()
      .setTitle(`Welcome to GitHub oAuth2 Authentication Discord Verify Bot 👋\n\nTo get Stated run \`/setup\` to create an authorization button.`)
      .setFooter({ text: "non-Official GitHub oAuth2 Authentication Discord Verify Bot" })
      .setColor(Colors.Blue)
      .setTimestamp();

    interaction.editReply({ embeds: [embed], ephemeral: true })
  },
};