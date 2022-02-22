// @ts-ignore
import {ButtonInteraction, MessageEmbed} from 'discord.js';
import {Element, Player} from '../types/coc';
import {getPlayerInfo} from '../API';
import {Elixir} from '../data/troops';

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;

    const args = interaction.customId.split(';');

    if (args.length !== 2) return;

    let player: Player;

    console.log(args);

    try {
      player = await getPlayerInfo(args[1].substring(1));
    } catch (e) {
      console.error(e);

      return;
    }

    let embed;

    switch (args[0]) {
      case 'stats':
        embed = embedStats(player);
        break;
      case 'troops':
        embed = embedTroops(player);
        break;
      case 'spells':
        embed = embedSpells(player);
        break;
      case 'heros':
        embed = embedHeros(player);
        break;
      default:
        break;
    }

    await interaction.update({embeds: [embedWrapper(embed, player)]});

    return;
  },
};

const embedWrapper = (embed: MessageEmbed, player: Player): MessageEmbed => {
  return embed
      .setAuthor({name: player.name + player.tag, iconURL: player.league.iconUrls.tiny});
};


const embedStats = (player: Player): MessageEmbed => {
  return new MessageEmbed()
      .addFields(
          [
            {name: 'TH', value: player.townHallLevel+'', inline: true},
            {name: 'LVL', value: player.expLevel+'', inline: true},
            {name: ':trophy:', value: player.trophies+'', inline: true},
          ]
      );
};

const embedTroops = (player: Player): MessageEmbed => {
  return new MessageEmbed()
      .addFields(
          player.troops.filter((t) => t.village === 'home' && Elixir.findIndex((e) => e === t.name) !== -1)
              .map((t) => ({
                name: t.name,
                value: formatElement(t),
                inline: true,
              }))
      );
};

const embedSpells = (player: Player): MessageEmbed => {
  return new MessageEmbed();
};

const embedHeros = (player: Player): MessageEmbed => {
  return new MessageEmbed();
};

const formatElement = (e: Element): string => {
  return e.level === e.maxLevel ? `:fire: ${e.level}` : `${e.level}/${e.maxLevel}`;
};
