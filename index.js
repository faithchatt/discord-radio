const { Client } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { voiceChannelId, playlistLink } = require('./variables')
require('dotenv').config()
const express = require('express')

const client = new Client({
	intents: ['Guilds', 'GuildVoiceStates', 'GuildMessages'],
});

// Create a new DisTube
const distube = new DisTube(client, {
    savePreviousSongs: true,
    emitNewSongOnly: false,
    emitAddListWhenCreatingQueue: true,
	searchSongs: 5,
	searchCooldown: 30,
	leaveOnEmpty: false,
	leaveOnFinish: false,
	leaveOnStop: false,
    plugins: [new SpotifyPlugin({
        parallel: true,
        emitEventsAfterFetching: true,
        api: {
          clientId: process.env.SPOTIFY_CLIENT_ID,
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        },
    })]
});

client.on('ready', async client => {
    let vcplay = client.channels.cache.get(voiceChannelId);
	distube.play(vcplay, playlistLink)
});

// DisTube event listeners, more in the documentation page
distube
	.on('addList', (queue, playlist) => {
        console.log(playlist.name)
        queue.repeatMode = 2
        queue.shuffle()
        queue.jump(1)
    })
    .on('playSong', (queue, song) => {
        console.log('Currently playing: ' + song.name + ' | now on ' + queue.songs.length + ' songs!')
    })


client.login(process.env.TOKEN);
try {
    const server = express();
    server.all("/", (req, res) => {
        res.send("Bot is running!");
    });

    server.listen(3000, () => {
        console.log("Server is ready.");
    });
} catch (error) {
    console.log(error);
}