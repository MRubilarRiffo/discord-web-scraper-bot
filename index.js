require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar cliente de Discord
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Conectar el bot de Discord
client.once('ready', () => {
    console.log(`Bot iniciado como ${client.user.tag}`);
});
client.login(process.env.DISCORD_TOKEN);

// Función para obtener datos de la web
async function fetchWebsiteData() {
    try {
        const { data } = await axios.get('https://ejemplo.com/api'); // Cambia por tu URL
        return data;
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return null;
    }
}

// Función para enviar un mensaje al canal de Discord
async function sendMessageToChannel(content) {
    try {
        const channel = await client.channels.fetch(process.env.CHANNEL_ID);
        if (channel) {
        await channel.send(content);
        } else {
        console.error('No se pudo encontrar el canal');
        }
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
}

// Ruta para activar el envío de datos
app.get('/send-data', async (req, res) => {
    const data = await fetchWebsiteData();
    if (data) {
        const message = `Datos obtenidos:\n${JSON.stringify(data, null, 2)}`;
        await sendMessageToChannel(message);
        res.status(200).send('Datos enviados correctamente');
    } else {
        res.status(500).send('Error al obtener o enviar los datos');
    }
});

// Iniciar servidor Express
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
