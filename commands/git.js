const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("git")
        .setDescription("Get Your GitHub Information"),
    async execute(interaction) {
        let GHData = await db.get(`user_github_${interaction.member.id}`)
        if (GHData === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`GitHub Data Not Found 🤔\n\nMake sure you have linked your account via Authentication Button.`).setColor(Colors.Blurple).setTimestamp()], ephemeral: true, });

        const embed = new EmbedBuilder()
            .setTitle(`Your GitHub Information`)
            .setDescription(
                `
**Id:** \`${GHData?.id ?? 'Not Found'}\`
**Name:** \`${GHData?.login ?? 'Not Found'}\`
**Username:** \`${GHData?.name ?? 'Not Found'}\`

**Blog:** \`${GHData?.blog ?? 'Not Found'}\`

**Company:** \`${GHData?.company ?? 'Not Found'}\`
**Location:** \`${GHData?.location ?? 'Not Found'}\`

**Twitter:** \`${GHData?.twitter_username ?? 'Not Found'}\`

**Followers:** \`${GHData?.followers ?? 'Not Found'}\`
**Following:** \`${GHData?.following ?? 'Not Found'}\`

**Public Repos:** \`${GHData?.public_repos ?? 'Not Found'}\`
**Public Gists:** \`${GHData?.public_gists ?? 'Not Found'}\`

**CreateAt** \`${GHData?.created_at ?? 'Not Found'}\`
**UpdatedAt** \`${GHData?.updated_at ?? 'Not Found'}\`
`)
            .setURL(GHData?.html_url ?? 'https://github.com/')
            .setThumbnail(GHData?.avatar_url ?? 'https://i.pinimg.com/736x/b5/1b/78/b51b78ecc9e5711274931774e433b5e6.jpg')
            .setFooter({ text: "non-Official GitHub oAuth2 Authentication Discord Verify Bot" })
            .setColor(Colors.Blue)
            .setTimestamp();

        interaction.editReply({ embeds: [embed], ephemeral: true })
    },
};