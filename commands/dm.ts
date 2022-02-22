import {Message} from 'discord.js';
import BD from '../BD';
import {VerificationToken} from '../types/coc';
import {verifyPlayer} from '../API';
import {User} from '../types/user';
import {Verification} from '../types/verification';
import dm from '../lang/dm';

const adminId = '300445415604617226';

const handlePossibleDM = async (message: Message) => {
  if (message.guild !== null || message.author.bot) return false;

  if (message.content.length !== 8 /* && message.author.id === adminId*/) {
    message.client.users.cache.get(adminId).send(`The user \`${message.author.username}\` send this message \`${message.content}\`.`)
        .then(() => {
          message.channel.awaitMessages({filter: (m: Message) => m.author.id === adminId, time: 50000, max: 1})
              .then((collected) => message.reply(collected.first().content));
        });

    return true;
  }

  let user: User;
  let verification: Verification;

  try {
    user = await BD.getInstance().getUser(message.author.id);
    verification = await BD.getInstance().checkVerification(user.id);

    if (!verification) return true;
  } catch (e) {
    console.error(e);
    return true;
  }

  try {
    const check: VerificationToken = await verifyPlayer(user.tag, message.content);

    if (check.status !== 'ok') {
      await message.reply(dm.message.error.invalidToken());

      return true;
    }

    await message.reply(dm.message.valid.verifed());

    try {
      await BD.getInstance().verifyUser(user.id);
      await BD.getInstance().deleteVerification(user.id);
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e.response.status); return true;
  }

  return true;
};

export {handlePossibleDM};
