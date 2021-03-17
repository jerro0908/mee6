const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');

client.on('message', msg => {
if (msg.content === 'deneme') {
msg.channel.send('deneme1')
  return
}
})

client.login(ayarlar.token)