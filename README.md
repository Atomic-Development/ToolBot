# ToolBot - A [Discord.js](https://discordjs.org) bot for EVE Online

[![Discord Server](https://img.shields.io/discord/733404108207292516?color=%237289DA&label=Discord&style=for-the-badge)](https://discord.gg/xJdPReJ)
[![GitHub Issues](https://img.shields.io/github/issues/Atomic-Development/ToolBot?style=for-the-badge)](https://github.com/Atomic-Development/ToolBot)
[![License](https://img.shields.io/github/license/Atomic-Development/ToolBot?style=for-the-badge)](https://atomic-development.mit-license.org/)

## What is this

This is the code for a [Discord](https://discord.com) bot that provides information and helpers for the [EVE Online](https://eveonline.com) MMORPG. The bot is written in JavaScript (ES5) and is available under an [MIT license](https://atomic-development.mit-license.org).

## What does it do

ToolBot retrieves information from [ESI](https://esi.evetech.net) and the [EVE Online Static Data Export](https://developers.eveonline.com/resource/resources) and displays it in Discord in response to commands. Currently ToolBot provides the following commands:

### Sysinfo

A system information command which returns information on the chosen system. Including *security level*, *true security*, *pirates*, *region*, *constellation*, *faction*, *minerals*, *jumps*, *ship kills*, *pod kills* and *NPC kills*. As well as helpful links to [DotLan](https://evemaps.dotlan.net), [Zkillboard](https://zkillboard.com) and [Akoik.is](https://anoik.is) for Wormhole systems.

#### Parameters

| Parameter | Type | Allowed Values | Description |
| --------- | ---- | -------------- | ----------- |
| System Name | String | Any valid complete or partial EVE system name | Uses a *fuzzy* search method so partials like *jit* or *dodi* work. |

#### Example

`!sysinfo jita`

#### Returns

![System information for Jita](https://i.imgur.com/enqGEmb.png)

### Ping

A simple online checker for the bot. Causes the bot to respond with `pong!`.

#### Example

`!ping`

#### Returns

`pong!`

### Price

A price check command that returns results for the prices of an item in a particular system/trade hub. Including *highest buy price*, *98th percentile of buy prices*, *lowest sell price*, *98th percentile of sell price*, *evepraisal link* and *last updated date/time*.

#### Parameters

| Parameter | Type | Allowed Values | Description |
| --------- | ---- | -------------- | ----------- |
| Source | String | `ep` or `evepraisal`, `em` or `evemarketer`, `fw` or `fuzzwork` | The information source to use to lookup the item/prices. |
| Item | String | any valid item type that exists in game | Item names containing spaces should be wrapped in quotation marks. `"` |
| Location | String | `Jita`, `Universe`, `Amarr`, `Dodixie`, `Hek`, `Rens` | Only one of the location types supported by EVEPraisal can be queried at a time. |

#### Example

`!price ep fedo jita`

#### Returns

![Price information for Fedo in Jita](https://i.imgur.com/H6iMMPJ.png)

### Reload

An administrator command that reloads the command file for the given command from disk. Useful for making changes without restarting the whole bot!

### Parameters

| Parameter | Type | Allowed Values | Description |
| --------- | ---- | -------------- | ----------- |
| Command | String | `info`, `ping`, `price`, `reload`, `route`, `time` | Only one of the commands supported by ToolBot can be reloaded at a time. |

#### Example

`!reload price`

#### Returns

`@Max Tsero, The command price has been reloaded`

### Route

A routing command that returns the number of jumps between two given systems using a provided routing flag.

#### Parameters

| Parameter | Type | Allowed Values | Description |
| --------- | ---- | -------------- | ----------- |
| Origin | String | Any valid complete or partial EVE system name | Uses a *fuzzy* search method so partials like *jit* or *dodi* work. |
| Destination | String | Any valid complete or partial EVE system name | Uses a *fuzzy* search method so partials like *jit* or *dodi* work. |
| Flag | String | A valid routing flag e.g `safe`, `unsafe` or `short` | Routing flags support a sizeable number of synonymous terms. |

#### Example

`!route jita dodixie short`

#### Returns

`ROUTE: Prefer shorter: Jita ⇆ Dodixie = 12 Jumps.`

### Time

A time command that returns the current time in EVE Online (UTC).

#### Example

`!time`

#### Returns

`In EVE it's currently Thursday, 16th July 2020, 22:13:33`

## Getting started

It's pretty straightforward to get running with the bot on your own server or computer! Though it's important to note that running this on your own PC could cause issues if you hit rate limits for ESI or EVEPraisal.

### Setting up a Discord bot

See this excellent [guide from Discord.js on how to setup your Discord bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html). There's not much point us re-explaining their excellent docs here!

### Getting the code

The first thing you'll need to do is clone this repository, the following command will clone the `latest` release into a folder named `toolbot`.

`git clone https://github.com/Atomic-Development/ToolBot toolbot`

If you want the current development branch you need to add `--branch develop`.

`git clone https://github.com/Atomic-Development/ToolBot --branch develop toolbot`

Once you have the code you'll need to configure the bot. Luckily we've provided an example config file to get you started. Copy `.env.example` to `.env` and replace the values with your chosen config. *You can also set the configuration using Environment Variables.* See the [Configuring ToolBot](#configuring-toolbot) section for detailed information on each config option/parameter.

### Adding your bot to your server

Again, the fine folks at Discord.js have written [another excellent guide on adding your bot to servers](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links) (*you only **need** to follow the linked section to use the bot*). Repeating that here would be silly!

### Starting the bot

So by now, all things going well you've either:

* Created a Discord bot application.
* Downloaded the code.
* Created your `.env` file (*or setup Environment Variables*) and configured your bot.
* Added your bot to one or more servers.

Or:

* Gotten drunk and given up altogether!

In the latter case, don't try and start your bot! Go back to your corp/alliance and tell them you failed.

In the former case you'll want to start your bot now!

If you haven't been messing around with any of the files (*except the config file*) you should be able to start the bot with:

`node .` or `node toolbot.js`

The bot will then spit out a bunch of helpful, reassuring text to let you know that it's alive:

> Skipped loading command finnan from finnan.js due to config.
> Loaded command help from help.js
> Loaded command ping from ping.js
> Loaded command price from price.js
> Loaded command reload from reload.js
> Loaded command route from route.js
> Loaded command sysinfo from sysinfo.js
> Loaded command time from time.js
> Ready to serve in 144 channels on 2 servers, for a total of 1182 users.

## Configuring ToolBot

ToolBot has many configurable options which live in it's `.env` file. There's an example config file (`.env.example`) in the root of the codebase for your information.

! Config Parameter | Type | Description |
| ---------------- | ---- | ----------- |
| TOKEN | String | Discord bot token (see [setting up a discord bot](#setting-up-a-discord-bot)) |
| PREFIX | String | The character(s) that indicate to your bot it should parse a message as a command |
| COMMANDS | Array | A JSON array of commands to load from disk, useful to skip loading certain commands! |
| EVEIMAGES | URL | The base URL for the EVE Images server, *you probably won't need to change this!* |
| TYPEIDURL | URL | A URL pointing to a fuzzwork-like typeID lookup service, *you probably won't need to change this!* |
| FWMARKETURL | URL | A URL pointing to a fuzzwork-compatible market lookup API, *you probably won't need to change this!* |
| EPITEMURL | URL | A URL pointing to an evepraisal-compatible market lookup API, *you probably won't need to change this!* |
| EMURL | URL | A URL pointing to an evemarketer-compatible market lookup API, *you probably won't need to change this!* |
| SYSTEMALIASES | Object | A JSON object of alias - system pairs which allow those commands that accept system names to substitute your alias for the full system name. |
| ADMINISTRATORS | Array | A JSON array of administrator user IDs who are allowed to reload commands and who may be able to access additional diagnostic information. To get the ID number try to call this command without any admin users set and the console will give you the ID of the user who tried. |
| BANNED | Array | A JSON array of banned user IDs who will not be allowed to interact with the bot in any way. |
