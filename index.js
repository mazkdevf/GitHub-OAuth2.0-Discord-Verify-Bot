require("dotenv").config();

const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Client, GatewayIntentBits, Collection, EmbedBuilder, Routes, Partials, Colors } = require("discord.js");

//* Initialize Discord.JS V14 Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences
    ],
    partials: [Partials.Channel]
})

//* Load Commands
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

//* Handle Discord.JS Errors ON console.error()
client.on("error", console.error);

//* Handle Unhandled Errors
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.once('ready', async () => {
    console.clear();
    console.log("Bot Online");
    console.log("Logged in as:", client.user.tag)

    //* Initialize Rest Connection
    const rest = new REST({
        version: "10"
    }).setToken(process.env.Discord_Token);

    //* Push commands to Discord Rest API
    (async () => {
        try {
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: commands
            });
            console.log("Commands have been added to Global Usage.")
        } catch (err) {
            console.error(err);
        }
    })();

    //* Set Bot Presence
    client.user.setPresence({
        activities: [
            {
                name: "Waiting for Authorizations...",
                type: "COMPETING",
                url: "https://github.com/mazk5145"
            }
        ],
        status: 'online'
    });

});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === "authorize") {
            await interaction.deferReply({ ephemeral: true });

            //* Load Express to handle the oAuth2 Authorization
            require("./handlers/index.js")(interaction)

            //* Give Interaction Creator the link for the Authorization
            interaction.editReply({
                content: `Authorize on: ${process.env.GitHub_REDIRECT_URI}login`,
                ephemeral: true
            });

        }
    }

    if (!interaction.type === 2) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    await interaction.deferReply({ ephemeral: true });

    const ErrorEmbed = new EmbedBuilder()
        .setAuthor({ name: "Interaction Failed" })
        .setColor(Colors.Red)

    try {
        await command.execute(interaction);
    } catch (err) {
        if (err) console.error(err);

        await interaction.editReply({
            embeds: [ErrorEmbed],
            ephemeral: true
        })
    }
});

//* Login to Discord JS Client with Environment Stored Discord Token
client.login(process.env.Discord_Token);