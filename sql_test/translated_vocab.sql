CREATE TABLE translated_vocab(
    id INTEGER PRIMARY KEY NOT NULL,
    question_id INTEGER NOT NULL,
    translated_options_text TEXT NOT NULL,

    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);

CREATE INDEX translated_vocab_question_id ON translated_vocab(question_id);

INSERT INTO translated_vocab (
    id,
    question_id,
    translated_options_text
) VALUES (
    1,
    1,
    'launch（開始、発売）'
);

INSERT INTO translated_vocab (
    id,
    question_id,
    translated_options_text
) VALUES (
    2,
    3,
    'equipment（機器、装置）'
);

INSERT INTO translated_vocab (
    id,
    question_id,
    translated_options_text
) VALUES (
    3,
    3,
    'property（不動産、物件）'
);

INSERT INTO translated_vocab (
    id,
    question_id,
    translated_options_text
) VALUES (
    4,
    4,
    'renovation（改装）'
);

INSERT INTO translated_vocab (
    id,
    question_id,
    translated_options_text
) VALUES (
    5,
    5,
    'assembly（組み立て、集まり）'
);