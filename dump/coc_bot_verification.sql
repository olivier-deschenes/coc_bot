create table verification
(
    id         int auto_increment
        primary key,
    user_id    int                                null,
    created_at datetime default CURRENT_TIMESTAMP null,
    constraint verification_id_uindex
        unique (id),
    constraint verification_user_id_fk
        unique (user_id),
    constraint verification_user_id_fk
        foreign key (user_id) references user (id)
            on delete cascade
);

