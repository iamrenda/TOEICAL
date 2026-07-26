CREATE TABLE writing_results (
    id SERIAL PRIMARY KEY,
    structure_score INTEGER NOT NULL,
    topic_relevancy_score INTEGER NOT NULL,
    grammar_score INTEGER NOT NULL,
    vocabulary_score INTEGER NOT NULL,
    overall_score INTEGER NOT NULL,
    better_essay TEXT NOT NULL,
    feedback_summary TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);