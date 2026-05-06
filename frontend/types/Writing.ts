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
