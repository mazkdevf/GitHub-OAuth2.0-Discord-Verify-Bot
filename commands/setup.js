const { SlashCommandBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup Authorization Button"),
    async execute(interaction) {
        const embed = new Discord.EmbedBuilder()
            .setTitle(`Welcome to GitHub oAuth2 Authentication Discord Verify Bot 👋`)
            .setFooter({ text: "non-Official GitHub oAuth2 Authentication Discord Verify Bot" })
            .setColor(Colors.Blue)
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('authorize')
                    .setLabel('Authorize Now!')
                    .setStyle(ButtonStyle.Primary),
            );

        interaction.editReply({ embeds: [embed], components: [row] })
    },
};