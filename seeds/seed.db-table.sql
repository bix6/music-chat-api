BEGIN;

-- cleanup
TRUNCATE message, person, chatroom RESTART IDENTITY CASCADE;

INSERT INTO chatroom (name, description)
VALUES
    ('Global', 'Welcome to the World Wide Music Chat!'), --1
    ('Playlists', 'What are your favorite playlists?'),
    ('Mood', 'How do you feel today?'),
    ('Artists', 'What are your favorite artists doing?'),
    ('Songs', 'All the single songs.'),
    ('Doin'' Time', 'All things Doin'' Time (Sublime, Lana, You?)'); --6

INSERT INTO person (name)
VALUES
    ('bix'), --1
    ('bix6'),
    ('bixbot'),
    ('bixby'),
    ('jack'), --5
    ('alicia'),
    ('dalbert'),
    ('brownie'),
    ('basil'),
    ('jerry'), --10
    ('timbo'),
    ('chester'),
    ('hubert'),
    ('nick'); --14

INSERT INTO message (content_type, message, content_id, chatroom_id, person_id)
VALUES
    ('text', 'Music Chat, Baby.', '', 1, 6),
    ('text', 'You don''t know my name.', '', 1, 5),
    ('text', 'But I know you''re Unbreakable.', '', 1, 6),
    ('text', 'If I Ain''t Got You, who would I be?', '', 1, 5),
    ('youtube video', '', 'rywUS-ohqeE', 1, 6),
    ('text', 'Let''s share playlists', '', 2, 7),
    ('text', 'OK', '', 2, 5),
    ('text', 'Please send Lorde to my estate', '', 2, 7),
    ('text', 'She''ll be escorted by 20 Golden Kiwis', '', 2, 5),
    ('text', 'My mood is sassy cuz it''s hot and I''m listening to Milkshake.', '', 3, 8),
    ('text', 'I''m so chilled out listening to Baby Take Off Your Cool.', '', 3, 9),
    ('text', 'Damn, that''s fresh Basil', '', 3, 8),
    ('text', 'Have you heard of Timbo?', '', 4, 10),
    ('text', 'Yes', '', 4, 11),
    ('text', 'He''s really good', '', 4, 10),
    ('text', 'No', '', 4, 11),
    ('text', 'I wrote a song', '', 5, 12),
    ('text', 'About what?', '', 5, 13),
    ('text', 'It''s about you Hubert', '', 5, 12),
    ('text', 'Alright we got songs.', '', 6, 14),
    ('text', 'Summertime and the coding is not easy', '', 6, 5),
    ('text', 'Ain''t no thang...', '', 6, 14);

COMMIT;