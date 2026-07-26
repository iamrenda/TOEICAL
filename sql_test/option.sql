CREATE TABLE option (
    id INTEGER PRIMARY KEY NOT NULL,
    question_id INTEGER NOT NULL,
    option_number INTEGER NOT NULL,
    option TEXT NOT NULL,
    translated_option TEXT,

    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);

CREATE INDEX idx_option_question_id ON option(question_id);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    1,
    1,
    1,
    'automatically',
    '(A) automatically（自動的に）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    2,
    1,
    2,
    'substantially',
    '(B) substantially（かなり）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    3,
    1,
    3,
    'sharply',
    '(C) sharply（急激に）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    4,
    1,
    4,
    'accordingly',
    '(D) accordingly（それに応じて）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    5,
    2,
    1,
    'regular',
    '(A) regular（定期的な）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    6,
    2,
    2,
    'regularly',
    '(B) regularly（副詞：定期的に）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    7,
    2,
    3,
    'regularize',
    '(C) regularize（動詞：規則化する）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    8,
    2,
    4,
    'regularity',
    '(D) regularity（名詞：規則性）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    9,
    3,
    1,
    'Because of',
    '(A) Because of（前置詞：～の理由で）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    10,
    3,
    2,
    'In case of',
    '(B) In case of（前置詞；～の場合に備えて）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    11,
    3,
    3,
    'Immediately',
    '(C) Immediately（副詞；すぐに）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    12,
    3,
    4,
    'If',
    '(D) If（もし～ならば）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    13,
    4,
    1,
    'frequent',
    '(A) frequent（頻繁な）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    14,
    4,
    2,
    'generous',
    '(B) generous（寛大な）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    15,
    4,
    3,
    'complicated',
    '(C) complicated（複雑な）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    16,
    4,
    4,
    'temporary',
    '(D) temporary（臨時の、一時的な）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    17,
    5,
    1,
    'annual',
    '(A) annual（年に１度の、毎年恒例の）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    18,
    5,
    2,
    'experienced',
    '(B) experienced（経験豊富な）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    19,
    5,
    3,
    'operational',
    '(C) operational（使用できる、運転可能な）'
);

INSERT INTO option (
    id,
    question_id,
    option_number,
    option,
    translated_option
) VALUES (
    20,
    5,
    4,
    'previous',
    '(D) previous（以前の）'
);