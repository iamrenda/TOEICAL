CREATE TABLE users_writing (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    writing_topic_id INTEGER NOT NULL,
    writing_content TEXT NOT NULL,
    writing_results_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (writing_topic_id) REFERENCES writing_topic(id) ON DELETE CASCADE,
    FOREIGN KEY (writing_results_id) REFERENCES writing_results(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_writing_user_id ON users_writing(user_id);
CREATE INDEX idx_users_writing_writing_topic_id ON users_writing(writing_topic_id);
CREATE INDEX idx_users_writing_writing_results_id ON users_writing(writing_results_id);