export const TEST_USER = {
    id: 99,
    username: "testing",
    email: "test@example.com",
    password: "password",
};

export const TEST_WRITING_DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

export const TEST_WRITING_TAGS = ["daily-life", "reflection", "opinion", "creativity", "social"] as const;

type WritingTopic = {
    id: number;
    topic: string;
    description: string;
    tags: (typeof TEST_WRITING_TAGS)[number][];
    difficulty: (typeof TEST_WRITING_DIFFICULTIES)[number];
    limit_time_minutes: number;
    recommended_word_count: number;
};

export const TEST_WRITING_TOPICS: WritingTopic[] = [
    {
        id: 1,
        topic: "TOPIC A",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        tags: ["daily-life", "reflection"],
        difficulty: "EASY",
        limit_time_minutes: 7,
        recommended_word_count: 70,
    },
    {
        id: 2,
        topic: "TOPIC B",
        tags: ["social"],
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        difficulty: "EASY",
        limit_time_minutes: 6,
        recommended_word_count: 65,
    },
    {
        id: 3,
        topic: "TOPIC C",
        tags: [],
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        difficulty: "MEDIUM",
        limit_time_minutes: 7,
        recommended_word_count: 75,
    },
    {
        id: 4,
        topic: "TOPIC D",
        tags: ["opinion"],
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        difficulty: "HARD",
        limit_time_minutes: 6,
        recommended_word_count: 65,
    },
    {
        id: 5,
        topic: "TOPIC E",
        tags: ["daily-life", "reflection", "opinion", "creativity", "social"],
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        difficulty: "HARD",
        limit_time_minutes: 7,
        recommended_word_count: 70,
    },
];
