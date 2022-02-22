import {Message} from 'discord.js';
import BD from '../BD';
import {handlePossibleRegistration} from '../commands/register';
import {handlePossibleDM} from '../commands/dm';
import {User} from '../types/user';
import {handlePossibleInfo} from '../commands/info';
import common from '../lang/common';

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message: Message) {
    const userID : String = message.author.id;
    let user: User;

    if (await handlePossibleDM(message)) return;

    if (message.author.bot || !message.content.startsWith('$')) return;

    try {
      user = await BD.getInstance().getUser(userID);

      if (!user) {
        await BD.getInstance().createUser(userID);
        user = await BD.getInstance().getUser(userID);
      }
    } catch (e) {
      console.error(e);
      return;
    }

    if (await handlePossibleRegistration(user, message)) return;

    const isVerify = user.tag != null;

    if (!isVerify) {
      await message.reply( common.message.error.notRegistered());
      return;
    }

    if (await handlePossibleInfo(user, message)) return;

    await message.reply(common.message.error.invalidCommand());
  },
};


