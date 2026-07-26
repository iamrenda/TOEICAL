CREATE TABLE detailed_description (
    id INTEGER PRIMARY KEY NOT NULL,
    question_id INTEGER NOT NULL,
    description TEXT NOT NULL,

    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);

CREATE INDEX idx_detailed_description_question_id ON detailed_description(question_id);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    1,
    1,
    'Ms. Ortega’s development team <span style="color:#cf2e2e" class="color"><strong>contributed</strong></span> ——– <strong><span style="color:#cf2e2e" class="color">to</span> <span style="color:#cf2e2e" class="color">the successful launch</span></strong> of the newest mobile application.'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    2,
    1,
    '空所の前後を見ます。空所に入る副詞が修飾するのは直前の動詞contributed（貢献した）で、to the successful launch（発売に）が続きます。動詞contributedと一番合う副詞は(B) substantially（かなり）となります。'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    3,
    1,
    '<strong>contributed substantially（かなり貢献した）で自然なフレーズになります。</strong>'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    4,
    1,
    'TOEICパート5の語彙問題はもっとも相性がいい選択肢、もっとも一緒に使われることが多い選択肢（コロケーション）が正解になると考えていいでしょう。'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    5,
    1,
    'この問題は動詞と修飾する副詞の相性を確認すれば解ける問題で、全文の意味を考える必要のない<strong>「部分読み問題」</strong>となります。<strong></strong>'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    6,
    2,
    'In order to meet production targets, inspection equipment that breaks down easily should be checked on <span style="color:#cf2e2e" class="color"><strong>a</strong></span> ——– <span style="color:#cf2e2e" class="color"><strong>basis</strong></span>.'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    7,
    2,
    '空所の前後を見ます。空所の前が冠詞a、後ろが名詞basis。一般的に【冠詞】+【形容詞】+【名詞】なので形容詞の(A) regular（定期的な）が正解になります。onから前は全く読むことなく解けてしまいます。'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    8,
    2,
    '<strong>品詞問題の基本公式：　【冠詞】+【形容詞】+【名詞】</strong>'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    9,
    2,
    'TOEICパート5の品詞問題は、空所の前後を見て判断できる問題が多いので、まずは前後を見ましょう。前後を見て解ける問題は、短時間で終えてパート７に時間を残しましょう。'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    10,
    2,
    'この問題は前後のみで判断できるので全文の意味を考える必要のない<strong>「部分読み問題」</strong>となります。<strong></strong>'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    11,
    3,
    '——– <strong><span style="color:#cf2e2e" class="color">you experience</span></strong> any problems with the building’s equipment, <strong><span style="color:#cf2e2e" class="color">you should contact </span></strong>the property manager.'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    12,
    3,
    '空所の後ろの形を見ます。you experienceで主語+動詞の形で、カンマ以降もyou should contactで主語+動詞の形になっています。したがって空所には接続詞が入ることがわかります。選択肢の中で接続詞は(D) If（もし～ならば）だけなので(D)を選びます。'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    13,
    3,
    'この問題のように、主語と動詞を確認して接続詞が入ることがわかり、選択肢の中に接続詞が１つだけならば文全体の意味を考える必要はありません。接続詞の候補が２つ以上ある場合は、全体の意味をとる必要があります。'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    14,
    3,
    'この問題は文の主語・動詞の確認のみで判断できるので全文の意味を考える必要のない<strong>「部分読み問題」</strong>となります。<strong></strong>'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    15,
    4,
    'Employees must park in the ——- <strong><span style="color:#cf2e2e" class="color">parking lot</span></strong> until the renovation of the company building is completed.'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    16,
    4,
    '空所の後ろに名詞句parking lot（駐車場）があります。parking lot（駐車場）と合うのは(D) temporary（臨時の、一時的な）です。時間を節約したい場合は、(D)を選んで次に進んでもいいですが、念のため意味を確認したい場合は、空所にtemporaryを入れてざっと内容を確認してもＯＫです。'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    17,
    4,
    '<strong>temporary parking lot（臨時駐車場）で自然なフレーズになります。</strong>'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    18,
    4,
    'TOEICパート5の語彙問題は空所の近くにヒントがあることが多いです。正確にかつスピードアップするためには、最初に修飾関係にある語句との相性を確認すべきです。問題文を頭から読んで理解する必要のない問題がかなり含まれますので、時間短縮のためにはできるだけ全文を読まないで答える練習がお勧めです。'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    19,
    4,
    'この問題は形容詞とその形容詞が修飾する名詞句の相性を確認すれば解ける問題で、全文の意味を考える必要のない<strong>「部分読み問題」</strong>となります。<strong></strong>'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    20,
    5,
    'Although<strong><span style="color:#cf2e2e" class="color"> the assembly machine</span></strong> has been used for more than 20 years, <strong><span style="color:#cf2e2e" class="color">it is</span> </strong>still ——–.'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    21,
    5,
    'it（=the assembly machine【組み立て機械】）の状態を表す形容詞が空所に入ります。合うのは(C) operational（使用できる、運転可能な）です。他の選択肢はmachineの状態を表すには不適切です。'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    22,
    5,
    '<strong>the assembly machine（組み立て機械） はoperational（使用できる、運転可能な）で自然なフレーズになります。</strong>'
);

INSERT INTO detailed_description (
    id,
    question_id,
    description
) VALUES (
    23,
    5,
    'この問題は主語Sと補語Cになる形容詞との相性を確認すれば解ける問題で、全文の意味を考える必要のない<strong>「部分読み問題」</strong>となります。<strong></strong>'
);