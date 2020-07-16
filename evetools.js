// Core setup/requirements.
const Discord = require('discord.js')
const client = new Discord.Client()
// Configuration.
const config = require('./config.json')
client.config = config
// Third party modules.
const Enmap = require('enmap')
const fs = require('fs')

// Events handlers.
fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    // If the file is not a JS file, ignore it (thanks, Apple)
    if (!file.endsWith('.js')) return
    // Load the event file itself
    const event = require(`./events/${file}`)
    // Get just the event name from the file name
    let eventName = file.split('.')[0]
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    // without going into too many details, this means each event will be called with the client argument,
    // followed by its "normal" arguments, like message, member, etc etc.
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client))
    delete require.cache[require.resolve(`./events/${file}`)]
  })
})

// Command handlers.
client.commands = new Enmap()

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    if (!file.endsWith('.js')) return
    // Load the command file itself
    let props = require(`./commands/${file}`)
    // Get just the command name from the file name
    let commandName = file.split('.')[0]
    console.log(`Attempting to load command ${commandName}`)
    // Here we simply store the whole thing in the command Enmap. We're not running it right now.
    client.commands.set(commandName, props)
  })
})

client.login(config.token)
