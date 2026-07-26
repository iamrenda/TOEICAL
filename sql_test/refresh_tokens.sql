CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    is_revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);