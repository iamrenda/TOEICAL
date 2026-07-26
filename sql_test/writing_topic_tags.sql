CREATE TABLE writing_topic_tags ( 
    writing_topic_id INTEGER, 
    writing_tag_id INTEGER,
    
    PRIMARY KEY (writing_topic_id, writing_tag_id),
    FOREIGN KEY (writing_topic_id) REFERENCES writing_topic(id),
    FOREIGN KEY (writing_tag_id) REFERENCES writing_tags(id)
);

INSERT INTO writing_topic_tags (writing_topic_id, writing_tag_id) VALUES (1, 1);
INSERT INTO writing_topic_tags (writing_topic_id, writing_tag_id) VALUES (1, 2);
INSERT INTO writing_topic_tags (writing_topic_id, writing_tag_id) VALUES (2, 1);
INSERT INTO writing_topic_tags (writing_topic_id, writing_tag_id) VALUES (2, 2);
INSERT INTO writing_topic_tags (writing_topic_id, writing_tag_id) VALUES (3, 1);
INSERT INTO writing_topic_tags (writing_topic_id, writing_tag_id) VALUES (3, 2);
INSERT INTO writing_topic_tags (writing_topic_id, writing_tag_id) VALUES (4, 1);
INSERT INTO writing_topic_tags (writing_topic_id, writing_tag_id) VALUES (5, 1);
INSERT INTO writing_topic_tags (writing_topic_id, writing_tag_id) VALUES (5, 5);