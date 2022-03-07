// @ts-ignore
import {ButtonInteraction, MessageEmbed} from 'discord.js';
import {Element, Player} from '../types/coc';
import {getPlayerInfo} from '../API';
import {DarkElixir as DarkElixirSpells, Elixir as ElixirSpells} from '../data/spells';
import {DarkElixir as DarkElixirTroops, Elixir as ElixirTroops} from '../data/troops';

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

    let embed: MessageEmbed[];

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

    await interaction.update({embeds: embed});

    return;
  },
};

const embedStats = (player: Player): MessageEmbed[] => {
  return [
    new MessageEmbed()
        .addFields(
            [
              {name: 'TH', value: player.townHallLevel + '', inline: true},
              {name: 'LVL', value: player.expLevel + '', inline: true},
              {name: ':trophy:', value: player.trophies + '', inline: true},
            ]
        ),
    new MessageEmbed()
        .setDescription(':european_castle: The player\'s clan stats')
        .addFields(
            [
              {name: 'Clan', value: player.clan.name + player.clan.tag + '', inline: true},
              {name: '\u200b', value: 'lvl ' + player.clan.clanLevel + '', inline: true},
              {name: '\u200b', value: 'f', inline: true},
            ]
        ),
  ];
};

const embedTroops = (player: Player): MessageEmbed[] => {
  return [
    new MessageEmbed()
        .setColor('PURPLE')
        .setDescription(':person_fencing: Stats on the Elixir Troops')
        .addFields(
            player.troops.filter((t) => t.village === 'home' && ElixirTroops.findIndex((e) => e === t.name) !== -1)
                .map((t) => ({
                  name: t.name,
                  value: formatElement(t),
                  inline: true,
                }))
        ),
    new MessageEmbed()
        .setColor('NOT_QUITE_BLACK')
        .setDescription(':person_fencing: Dark Elixir Troops')
        .addFields(
            player.troops.filter((t) => t.village === 'home' && DarkElixirTroops.findIndex((e) => e === t.name) !== -1)
                .map((t) => ({
                  name: t.name,
                  value: formatElement(t),
                  inline: true,
                }))

        ),
  ];
};

const embedSpells = (player: Player): MessageEmbed[] => {
  return [
    new MessageEmbed()
        .setColor('PURPLE')
        .setDescription(':test_tube: Stats on the Elixir Spells')
        .addFields(
            player.spells.filter((t) => ElixirSpells.findIndex((e) => e === t.name) !== -1)
                .map((t) => ({
                  name: t.name,
                  value: formatElement(t),
                  inline: true,
                }))
        ),
    new MessageEmbed()
        .setColor('NOT_QUITE_BLACK')
        .setDescription(':test_tube: Stats on the Elixir Spells')
        .addFields(
            player.spells.filter((t) => DarkElixirSpells.findIndex((e) => e === t.name) !== -1)
                .map((t) => ({
                  name: t.name,
                  value: formatElement(t),
                  inline: true,
                }))

        ),
  ];
};

const embedHeros = (player: Player): MessageEmbed[] => {
  return [
    new MessageEmbed()
        .setDescription(':man_mage: Stats on the Heros')
        .setColor('DARK_AQUA')
        .addFields(player.heroes.map((h) => ({name: h.name, value: formatElement(h), inline: true}))),
  ];
};

const formatElement = (e: Element): string => {
  return e.level === e.maxLevel ? `:fire: ${e.level}` : `${e.level}/${e.maxLevel}`;
};
