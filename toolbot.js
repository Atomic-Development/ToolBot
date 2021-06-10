// Core setup/requirements.
const Discord = require('discord.js')
const client = new Discord.Client()
client.commands = new Discord.Collection()
global.cooldowns = new Discord.Collection()
// Configuration.
require('dotenv').config()
const env = require('env-var')
const token = env.get('TOKEN').asString()
// Third party modules.
const fs = require('fs')
const winston = require('winston')
// Utils
const system = require('./utils/system')
// Logger Setup
client.logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'toolbot.log'
    }),
  ],
  format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
})

// Command handlers.
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  if (system.checkCommand(command.name)) {
    client.commands.set(command.name, command)
    client.logger.log('info',`Loaded command ${command.name} from ${file}`)
  } else {
    client.logger.log('warn',`Skipped loading command ${command.name} from ${file} due to config.`)
  }
}

// Event handlers.
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  let eventName = event.name
  client.on(eventName, event.listen.bind(null, client))
  delete require.cache[require.resolve(`./events/${file}`)]
}

client.login(token)
