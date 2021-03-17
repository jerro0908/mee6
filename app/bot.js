const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);
const db = require('quick.db');
var prefix = ayarlar.prefix;
require('./ekran2.js');

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

///////////////////////////////////////////////////////////////////KOMUT BAŞLANGIÇ/////////////////////////////////////////////////////////////////////////




client.on('ready', () => {
console.log(client.user.username + ' Sistemi Başaltıldı')
  console.log(`Bot ${client.guilds.size} Sunucuya Hizmet Sunuyor.`)
  console.log(`Bot ${client.users.size} Kişiye Hizmet Sunuyor.`)
})




//level başlangıç
client.on("message", msg => {
  if (msg.channel.type === "dm") return;
  if(msg.author.bot) return;
  const dil = db.fetch(`${msg.guild.id}.dil`)
  if (dil === 'en') {
      const sa = db.has(`${msg.author.id}.${msg.guild.id}.lvll`) ? db.fetch(`${msg.author.id}.${msg.guild.id}.lvll`) * 100 : 100
  db.add(`${msg.author.id}.${msg.guild.id}.xpp`, 1)
  const xp = db.fetch(`${msg.author.id}.${msg.guild.id}.xpp`)
  const xpc = db.fetch(`${msg.author.id}.${msg.guild.id}.lv`)
  if (xp >= sa) {
 db.add(`${msg.author.id}.${msg.guild.id}.lvll`, 1)
    db.add(`${msg.author.id}.${msg.guild.id}.lv`, 100)
    const level = db.fetch(`${msg.author.id}.${msg.guild.id}.lvll`)
    msg.channel.send(`You've leveled! You are now at the level of ${level} !`)
  return
  }
  return
  }
    const sa = db.has(`${msg.author.id}.${msg.guild.id}.lvll`) ? db.fetch(`${msg.author.id}.${msg.guild.id}.lvll`) * 100 : 100
  db.add(`${msg.author.id}.${msg.guild.id}.xpp`, 1)
  const xp = db.fetch(`${msg.author.id}.${msg.guild.id}.xpp`)
  const xpc = db.fetch(`${msg.author.id}.${msg.guild.id}.lv`)
  if (xp >= sa) {
 db.add(`${msg.author.id}.${msg.guild.id}.lvll`, 1)
    db.add(`${msg.author.id}.${msg.guild.id}.lv`, 100)
    const level = db.fetch(`${msg.author.id}.${msg.guild.id}.lvll`)
    msg.channel.send('Level Atladın! Artık ' + level + ' Levelindesin!')
  return
  }
})
//level bitiş


client.login(ayarlar.token);