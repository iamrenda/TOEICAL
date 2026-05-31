export interface WritingTopic {
    id: number;
    topic: string;
    description: string;
    difficulty: WritingDifficulty;
    limit_time_minutes: number;
    recommended_word_count: number;
    tags: WritingTags[];
}

export enum WritingDifficulty {
    ALL = "ALL",
    Easy = "EASY",
    Medium = "MEDIUM",
    Hard = "HARD",
}

export enum WritingTags {
    ALL = "ALL",
    "daily_life" = "daily-life",
    "reflection" = "reflection",
    "opinion" = "opinion",
    "creativity" = "creativity",
    "social" = "social",
}

export interface WritingEssayAnalysisInput {
    topic: string;
    topicId: number;
    description: string;
    essay: string;
    difficulty: WritingDifficulty;
    timeLimit: number;
    timeTaken: number;
    wordCount: number;
}

export interface WritingEssayAnalysisOutput {
    structure_score: number;
    topic_relevancy_score: number;
    grammar_score: number;
    vocabulary_score: number;
    overall_score: number;
    revised_essay: string;
    feedback_summary: string;
}
