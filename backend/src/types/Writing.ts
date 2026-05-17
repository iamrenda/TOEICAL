export type AIWritingResult = {
    structure_score: number;
    topic_relevancy_score: number;
    grammar_score: number;
    vocabulary_score: number;
    overall_score: number;
    revised_essay: string;
    feedback_summary: string;
};
