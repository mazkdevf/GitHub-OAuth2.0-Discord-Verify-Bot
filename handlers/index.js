//* Express Server
const express = require("express"); // Import Express module

//* Random UUID Creator
const uuidv4 = require("uuid")

//* Axios
const axios = require('axios');
const oauth = require('axios-oauth-client');

//* Initializing Express
const app = express(); // INIT Express as app
const port = 3000; // Web Listener Port

//* Quick DB For GitHub User Data Store
const db = require('quick.db')

module.exports = (interaction) => {

    //* If Request is http://localhost:port/ <-- go to Authentication Link
    app.get("/", async (req, res) => {
        res.redirect("/login");
    });


    //* Authorize to GitHub
    app.get("/login", async (req, res) => {
        if (interaction.member.id === null) {
            res.send('Error: Member is not in the guild, Please try again from Discord.');
            return false;
        }

        this.uniqId = await uuidv4.v4();

        const params = new URLSearchParams({
            'client_id': process.env.GitHub_APP_CLIENTID,
            'redirect_uri': 'http://localhost:3000/callback',
            'scope': 'user',
            'state': this.uniqId
        });

        res.redirect(process.env.GitHub_AuthorizeUrl + '?' + params.toString());
    });

    //* Callback for OAuth2.0
    app.get("/callback", async (req, res) => {
        if (!req.query.code || !req.query.state) {
            res.redirect('/login');
            return false;
        }

        const APIRequest = oauth.client(axios.create(), {
            url: process.env.GitHub_TokenUrl,
            client_id: process.env.GitHub_APP_CLIENTID,
            client_secret: process.env.GitHub_APP_SECRET,
            redirect_uri: 'http://localhost:3000/callback',
            code: req.query.code,
            scope: req.query.state,
        });

        const ResponseFromAPI = await APIRequest();

        if (!ResponseFromAPI) {
            res.send('Error');
            return false;
        }

        if (ResponseFromAPI.includes('error=bad_verification_code')) {
            res.send('Unable to verify, Reason: Verification Code is invalid <br><br> <a style="color: blue; font-weight: 700;" href="http://localhost:3000/login">Try Again</a>');
            return false;
        }

        const urlSearchParams = new URLSearchParams(ResponseFromAPI);
        const params = Object.fromEntries(urlSearchParams.entries());

        this.accessToken = params.access_token;
        this.refreshToken = params.refresh_token;

        res.redirect("/authorize");
    });


    //* Authorize User on GitHub to get Data & also Save Data to DB
    app.get("/authorize", async (req, res) => {
        if (!this.accessToken) {
            res.redirect('/login');
            return false;
        }

        if (interaction.member.id === null) {
            res.send('Error: Member is not in the guild, Please try again from Discord.');
            return false;
        }

        var config = {
            url: process.env.GitHub_API_BaseUrl + 'user',
            headers: {
                'Authorization': 'Bearer ' + this.accessToken
            }
        };

        var data = await axios(config).then(function (res) {
            return res.data;
        });

        console.log(data);

        res.send(`<h1>Successfully Authorized - Hello ${data.login} 👋</h1>`);

        db.fetch(`user_github_${interaction.member.id}`)
        db.set(`user_github_${interaction.member.id}`, data)


        // Add Discord Role
        let role = interaction.member.guild.roles.cache.find(r => r.id === process.env.Discord_Verifed_RoleId);

        try {
            interaction.guild.members.cache.get(interaction.member.id).roles.add(role);
        } catch (error) {

        }


        await interaction.editReply({
            content: `Hello ${data.login} 👋, And Welcome to the Server!`,
            ephemeral: true
        });
    });

    //* Start Express Server
    app.listen(port, () => {
        console.log('Listening on port: ', port);
    }).on('error', (e) => {
        if (e.message === `listen EADDRINUSE: address already in use :::${port}`) {
            console.log(`Returning since port ${port} is already in use`);
        } else {
            console.log(e.message);
        }
    });
};