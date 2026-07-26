CREATE TABLE writing_tags (
    id SERIAL PRIMARY KEY,
    tag TEXT NOT NULL
);

INSERT INTO writing_tags (tag) VALUES 
('daily-life'),
('reflection'),
('opinion'),
('creativity'),
('social');