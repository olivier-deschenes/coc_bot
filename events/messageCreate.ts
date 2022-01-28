import {Message} from 'discord.js';
import BD from '../BD';
import user from '../types/user';
import verification from '../types/verification';
import {getPlayerInfo, verifyPlayer} from '../API';
import {Player, VerificationToken} from '../types/coc';


const adminId = '300445415604617226';

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message: Message) {
    const userID : String = message.author.id;
    let user: user;

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
      await message.reply(
          'You need to register first before using this bot\'s commands. Type > Register {playerTag}'
      );
    }

    if (await handlePossibleInfo(user, message)) return;
  },
};

const handleInvalidTag = (tag: String, message: Message) => {
  message.reply(`Oups ! Seems like the tag \`${tag}\` is invalide !`);
};

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

  let user: user;
  let verification: verification;

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
      await message.reply('Oups! Its seems like the token is invalid.');

      return true;
    }

    await message.reply('Good! Your are now verified.');

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

const handlePossibleRegistration = async (user: user, message: Message) => {
  if (!message.content.startsWith('$register ')) return false;

  if (user.is_verify) {
    message.reply('Oups! Seems like you are already verify :)');
    return;
  }

  let tag = message.content.substring('$register '.length);

  if (!tag.startsWith('#')) {
    tag = '#' + tag;
  }

  let player: Player;

  try {
    player = await getPlayerInfo(tag.substring(1));
  } catch (e) {
    handleInvalidTag(tag, message);

    return true;
  }

  await BD.getInstance().addUserTag(user.id, player.tag.substring(1));

  await message.reply('You are now registered on our database ! check your dm to verify that this account is yours.');

  await message.author.send('Hey ! Send me your unique verification code so I can verify your account.');

  await BD.getInstance().createVerification(user.id);

  return true;
};

const handlePossibleInfo = async (user: user, message: Message) => {
  if (!message.content.startsWith('$info ') && !(message.content === '$info')) return false;

  let player: Player;

  try {
    player = await getPlayerInfo(user.tag);
  } catch (e) {
    console.log(e);
    return true;
  }

  console.log(player.clan.name);

  return true;
};
