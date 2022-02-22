import {User} from '../types/user';
import {Message, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {Player} from '../types/coc';
import {getPlayerInfo} from '../API';

export const handlePossibleInfo = async (user: User, message: Message) => {
  if (!message.content.startsWith('$info ') && !(message.content === '$info')) return false;

  let player: Player;

  try {
    player = await getPlayerInfo(user.tag);
  } catch (e) {
    console.log(e);
    return true;
  }

  const row = new MessageActionRow()
      .addComponents(
          [
            new MessageButton()
                .setCustomId(`stats;${player.tag}`)
                .setLabel('Stats')
                .setStyle('DANGER'),
            new MessageButton()
                .setCustomId(`troops;${player.tag}`)
                .setLabel('Troops')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId(`spells;${player.tag}`)
                .setLabel('Spells')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId(`heros;${player.tag}`)
                .setLabel('Heros')
                .setStyle('SUCCESS'),
          ]
      );

  const embed = new MessageEmbed()
      .setDescription('Press a button to see the player\'s data !');

  await message.channel.send({content: 'Here', components: [row], embeds: [
    embed,
  ]});
  return true;
};
