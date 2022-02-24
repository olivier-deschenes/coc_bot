create table user
(
    id         int auto_increment
        primary key,
    discord_id varchar(18)          not null,
    tag        varchar(9)           null,
    is_verify  tinyint(1) default 0 null,
    constraint user_discord_id_uindex
        unique (discord_id),
    constraint user_id_uindex
        unique (id),
    constraint user_tag_uindex
        unique (tag)
);

INSERT INTO coc_bot.user (id, discord_id, tag, is_verify) VALUES (1, '300445415604617226', '2P2PJQ0CY', 1);
