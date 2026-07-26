CREATE TABLE question (
    id INTEGER PRIMARY KEY NOT NULL,
    question TEXT NOT NULL,
    correct_option_id INTEGER NOT NULL,
    translated_question TEXT NOT NULL,
    type_description TEXT NOT NULL
);

INSERT INTO question (
    id,
    question,
    correct_option_id,
    translated_question,
    type_description
) VALUES (
    1,
    'Ms. Ortega’s development team contributed ——– to the successful launch of the newest mobile application.',
    2,
    'Ortegaさんの開発チームは、最新のモバイルアプリケーションの発売にかなり貢献しました。',
    '選択肢がすべて-lyで終わる副詞なので「語彙問題」であることがわかります。空所に入る副詞が修飾する語（動詞、形容詞など）がヒントになると予想します。'
);

INSERT INTO question (
    id,
    question,
    correct_option_id,
    translated_question,
    type_description
) VALUES (
    2,
    'In order to meet production targets, inspection equipment that breaks down easily should be checked on a ——– basis.',
    5,
    '生産目標を達成するために、故障しやすい検査装置は定期的に点検してもらったほうがいい。',
    '選択肢を見ると、似たようなスペルなので「品詞問題」と判断できます。空所の前後を見て判断できるものが多いのが品詞問題です。'
);

INSERT INTO question (
    id,
    question,
    correct_option_id,
    translated_question,
    type_description
) VALUES (
    3,
    '——– you experience any problems with the building’s equipment, you should contact the property manager.',
    12,
    '建物の設備に何らかの不具合があった場合、不動産管理人に連絡してください。',
    '選択肢を見ると、前置詞句、前置詞句、副詞、接続詞の【接続詞・前置詞・副詞問題】であることがわかります。'
);

INSERT INTO question (
    id,
    question,
    correct_option_id,
    translated_question,
    type_description
) VALUES (
    4,
    'Employees must park in the ——- parking lot until the renovation of the company building is completed.',
    16,
    '社屋の改装工事が完了するまで、社員は臨時駐車場に停めなければならない。',
    '選択肢が形容詞なので「語彙問題」であることがわかります。空所の形容詞と続く名詞句の相性がヒントになります。'
);

INSERT INTO question (
    id,
    question,
    correct_option_id,
    translated_question,
    type_description
) VALUES (
    5,
    'Although the assembly machine has been used for more than 20 years, it is still ——–.',
    19,
    'その組立機械は20年以上使われているけれども、いまだに使用できる。',
    '選択肢が形容詞なので「語彙問題」であることがわかります。主語のit（=the assembly machine）と空所の形容詞との相性がヒントになります。構文で言うと第２文型（主語S+動詞V+補語C）の主語Sと補語Cの関係に着目します。'
);