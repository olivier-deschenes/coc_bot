export interface Player {
    league: League;
    clan: Clan;
    role: string;
    warPreference: string;
    attackWins: number;
    defenseWins: number;
    townHallLevel: number;
    townHallWeaponLevel: number;
    versusBattleWins: number;
    legendStatistics: LegendStatistics;
    troops: Element[];
    heroes: Element[];
    spells: Element[];
    labels: League[];
    tag: string;
    name: string;
    expLevel: number;
    trophies: number;
    bestTrophies: number;
    donations: number;
    donationsReceived: number;
    builderHallLevel: number;
    versusTrophies: number;
    bestVersusTrophies: number;
    warStars: number;
    achievements: Achievement[];
    versusBattleWinCount: number;
}

export interface Achievement {
    stars: number;
    value: number;
    name: BadgeUrls;
    target: number;
    info: BadgeUrls;
    completionInfo: BadgeUrls;
    village: string;
}

export interface BadgeUrls {
    tiny: string,
    small: string,
    medium: string
}

export interface Clan {
    tag: string;
    clanLevel: number;
    name: string;
    badgeUrls: BadgeUrls;
}

export interface Element {
    level: number;
    name: string;
    maxLevel: number;
    village?: string;
    superTroopIsActive?: boolean;
}

export interface League {
    name: BadgeUrls;
    id: number;
    iconUrls: BadgeUrls;
}

export interface LegendStatistics {
    legendTrophies: number;
    previousVersusSeason: Season;
    previousSeason: Season;
    bestSeason: Season;
    currentSeason: Season;
    bestVersusSeason: Season;
}

export interface Season {
    trophies: number;
    id: string;
    rank: number;
}

export interface VerificationToken {
    tag: string;
    token: string;
    status: string;
}

