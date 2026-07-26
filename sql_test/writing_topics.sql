CREATE TABLE writing_topic (
    id SERIAL PRIMARY KEY,
    topic TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT NOT NULL,  -- EASY, MEDIUM, HARD
    limit_time_minutes INTEGER NOT NULL,
    recommended_word_count INTEGER NOT NULL
);

INSERT INTO writing_topic 
(topic, description, difficulty, limit_time_minutes, recommended_word_count)
VALUES ('Describe your perfect morning routine.', 'Write about what you do (or wish you could do) from the moment you wake up until you start your day. Include details about what makes it perfect for you.', 'EASY', 7, 70);
INSERT INTO writing_topic 
(topic, description, difficulty, limit_time_minutes, recommended_word_count)
VALUES ('What is your favorite food and why?', 'Describe a dish you love and explain what makes it special to you. Is it the taste, the memories, or the person who cooks it?', 'EASY', 6, 65);
INSERT INTO writing_topic 
(topic, description, difficulty, limit_time_minutes, recommended_word_count)
VALUES ('Describe the place where you feel most relaxed.', 'Write about a specific place — a room, a park, a café — where you feel calm and happy. Describe what you see, hear, and feel there.', 'EASY', 7, 75);
INSERT INTO writing_topic 
(topic, description, difficulty, limit_time_minutes, recommended_word_count)
VALUES ('What do you do on a typical weekend?', 'Walk the reader through a regular weekend day in your life. Include the small details that make your weekends yours.', 'EASY', 6, 65);
INSERT INTO writing_topic 
(topic, description, difficulty, limit_time_minutes, recommended_word_count)
VALUES ('Describe your closest friend.', 'Write about one person you are close to. What do they look like? What do you enjoy doing together? What makes them a good friend?', 'EASY', 7, 70);