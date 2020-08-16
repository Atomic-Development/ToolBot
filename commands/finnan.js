/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
module.exports = {
  name: 'finnan',
  description: 'Recites the Finnan\'s prayer.',
  usage: '',
  cooldown: 5,
  /**
   * Provides the current in-game time!.
   * @param {object} client - An object containing the Discord client information.
   * @param {object} message - An object containing the message the bot is reponding to.
   * @param {array} args - An array containing the parsed arguments for the command.
   * @return {null}
   */
  run (client, message, args) {
    // Construct our final output message.
    var messageText = `> Our Finnan, who art in Nullsec,
    > Hallowed be thy BLOPs.
    > Thy Bombers come,
    > Thy clorping be done,
    > in null, as it is in WH.
    > Give us this day our daily bridge,
    > as we destroy those who trespass against us!
    > Lead us not into explosions,
    > but deliver our damage.
    > For thine is the killmail,
    > the loot and the glory.
    > For ever and ever
    > Finnan.`
    message.channel.send(messageText)
  }
}