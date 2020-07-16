[![Discord Server](https://img.shields.io/discord/733404108207292516?color=%237289DA&label=Discord&style=for-the-badge)](https://discord.gg/xJdPReJ)
[![GitHub Issues](https://img.shields.io/github/issues/Atomic-Development/EVETools?style=for-the-badge)](https://github.com/Atomic-Development/EVETools)
[![License](https://img.shields.io/github/license/Atomic-Development/EVETools?style=for-the-badge)](https://atomic-development.mit-license.org/)

# EVETools - A [Discord.js](https://discordjs.org) bot for EVE Online

## What is this

This is the code for a [Discord](https://discord.com) bot that provides information and helpers for the [EVE Online](https://eveonline.com) MMORPG. The bot is written in JavaScript (ES6) and is available under an [MIT license](https://atomic-development.mit-license.org).

## What does it do

Currently the EVE Tools bot provides the following commands:

### Info

A system information command which returns information on the chosen system. Including *security level*, *true security*, *pirates*, *region*, *constellation*, *faction*, *minerals*, *jumps*, *ship kills*, *pod kills* and *NPC kills*. As well as helpful links to [DotLan](https://evemaps.dotlan.net), [Zkillboard](https://zkillboard.com) and [Akoik.is](https://anoik.is) for Wormhole systems.

**Invocation example:** !info jita

**Returns:**  
![System information for Jita](https://i.imgur.com/enqGEmb.png)

### Ping

A simple online checker for the bot. Causes the bot to respond with `pong!`.

**Invocation example:** !ping

**Returns:**  
`pong!`

### Price

A price check command that returns [EVEPraisal](https://evepraisal.com) results for the prices of an item in a particular system/trade hub. Including *highest buy price*, *98th percentile of buy prices*, *lowest sell price*, *98th percentile of sell price*, *evepraisal link* and *last updated date/time*.

**Invocation example:** !price jita fedo

**Returns:**  
![Price information for Fedo in Jita](https://i.imgur.com/H6iMMPJ.png)
