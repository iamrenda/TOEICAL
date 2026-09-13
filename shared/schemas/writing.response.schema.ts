import { z } from "zod";

export const WritingAiAnalysisResponseSchema = z.object({
    structure_score: z.number().min(1).max(100),
    topic_relevancy_score: z.number().min(1).max(100),
    grammar_score: z.number().min(1).max(100),
    vocabulary_score: z.number().min(1).max(100),
    overall_score: z.number().min(1).max(100),
    revised_essay: z.string(),
    feedback_summary: z.string(),
});

export const WritingResponseSchema = z.object({
    structure_score: z.number().min(1).max(100),
    topic_relevancy_score: z.number().min(1).max(100),
    grammar_score: z.number().min(1).max(100),
    vocabulary_score: z.number().min(1).max(100),
    overall_score: z.number().min(1).max(100),
    revised_essay: z.string(),
    feedback_summary: z.string(),
});

export const WritingTopicResponseSchema = z.object({
    id: z.number().int(),
    topic: z.string(),
    description: z.string(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    limit_time_minutes: z.number().int().min(1),
    recommended_word_count: z.number().int().min(1),
    tags: z.array(z.enum(["daily-life", "reflection", "opinion", "creativity", "social"])),
});

export const WritingTopicListResponseSchema = z.array(WritingTopicResponseSchema);

export const WritingHistoryResponseSchema = z.object({
    topic: z.string(),
    description: z.string(),
    writing_content: z.string(),
    id: z.number().int(),
    structure_score: z.number().min(1).max(100),
    topic_relevancy_score: z.number().min(1).max(100),
    grammar_score: z.number().min(1).max(100),
    vocabulary_score: z.number().min(1).max(100),
    overall_score: z.number().min(1).max(100),
    revised_essay: z.string(),
    feedback_summary: z.string(),
});

export const WritingHistoryListResponseSchema = z.array(WritingHistoryResponseSchema);

export type WritingAiAnalysisResponse = z.infer<typeof WritingAiAnalysisResponseSchema>;
export type WritingResponse = z.infer<typeof WritingResponseSchema>;
export type WritingTopicResponse = z.infer<typeof WritingTopicResponseSchema>;
export type WritingTopicListResponse = z.infer<typeof WritingTopicListResponseSchema>;
export type WritingHistoryResponse = z.infer<typeof WritingHistoryResponseSchema>;
export type WritingHistoryListResponse = z.infer<typeof WritingHistoryListResponseSchema>;
