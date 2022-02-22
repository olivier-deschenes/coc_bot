import {Message} from 'discord.js';
import {Player} from '../types/coc';
import {getPlayerInfo} from '../API';
import BD from '../BD';
import {User} from '../types/user';
import lang from '../lang/register';
import common from '../lang/common';

const handlePossibleRegistration = async (user: User, message: Message) => {
  if (message.content === '$register') {
    await message.reply(common.message.error.missingPlayerTag('$register {playerTag}'));
    return true;
  }

  if (!message.content.startsWith('$register ')) return false;

  if (user.is_verify) {
    await message.reply(lang.message.error.alreadyVerify());
    return true;
  }

  let tag = message.content.substring('$register '.length);

  if (!tag.startsWith('#')) {
    tag = '#' + tag;
  }

  let player: Player;

  try {
    player = await getPlayerInfo(tag.substring(1));
  } catch (e) {
    console.error(e);
    await message.reply(common.message.error.invalidPlayerTag(tag));

    return true;
  }

  await BD.getInstance().addUserTag(user.id, player.tag.substring(1));

  await message.reply(lang.message.valid.registered());

  await message.author.send(lang.message.valid.verificationNotification());

  await BD.getInstance().createVerification(user.id);

  return true;
};

export {handlePossibleRegistration};
