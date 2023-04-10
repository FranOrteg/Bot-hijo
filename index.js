const express = require('express');
const axios = require('axios').default;
const { Telegraf } = require('telegraf');
const { Configuration, OpenAIApi } = require("openai");
const { chatGPT } = require('./utils');

// Config .env
require('dotenv').config();

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// Configuración Telegraf
app.use(bot.webhookCallback('/telegram-bot'));
bot.telegram.setWebhook(`${process.env.BOT_URL}/telegram-bot`);

app.post('/telegram-bot', (req, res) => {
    res.send('Hola Bot');
});

// COMANDOS
bot.command('test', (ctx) => {
    ctx.reply('Funsionaaaa!!!!');
    ctx.replyWithDice();
    ctx.replyWithPhoto('https://www.lavanguardia.com/files/og_thumbnail/uploads/2019/07/10/5fa53b26e9f2d.jpeg')
});

bot.command('hola', (ctx) => {
    ctx.reply('Holi Caracoli')
});

bot.command('tiempo', async (ctx) => {
    const ciudad = ctx.message.text.substring(7).trim(); // tiempo Madrid

    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${process.env.OWM_API_KEY}&units=metric`);

    const {
        main: { temp, temp_min, temp_max, humidity },
        coord: { lon, lat }
    } = data;

    ctx.reply(`Los datos de temperatura en ${ciudad}:
        🌡️ Actual: ${temp}º
        🔥 Máxima: ${temp_max}º
        ❄️ Mínima: ${temp_min}º
        💧 Humedad: ${humidity}º
    `);
    ctx.replyWithLocation(lat, lon);
});

bot.command('receta', async ctx => {
    // receta huevos, aguacate, chorizo
    const ingredientes = ctx.message.text.substring(7).trim();

    try {
        const titulo = await chatGPT(`Dame el titulo de una receta que pueda cocinar con los siguientes ingredientes: ${ingredientes}`);

        const elaboracion = await chatGPT(`Dame la elaboración para la receta con este título: ${titulo}`)

        ctx.reply(titulo);
        ctx.reply(elaboracion);
    } catch (error) {
        ctx.reply('No puedo responderte en estos momentos, intentalo de nuevo mas tarde');
    }


});

bot.on('message', async (ctx) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-4",
            max_tokens: 100,
            messages: [
                { role: 'assistant', content: 'Eres un bot de telegram. Tu nombre es @bot-hijo. Todas las respuestas las devuelves como si fueras el recio de la que se avecina' },
                { role: 'user', content: `Respondeme en menos de 100 caracteres al siguiente texto:${ctx.message.text}` }
            ]
        });

        ctx.reply(completion.data.choices[0].message.content);
    } catch (error) {
        ctx.reply('No puedo responderte en estos momentos, intentalo de nuevo mas tarde');
    }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});




