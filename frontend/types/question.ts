export interface Option {
    option: string;
    option_id: number;
    translated_option: string;
}

export interface Question {
    id: number;
    is_starred: boolean;

    question: string;
    translated_question: string;

    options: Option[];
    correct_option_id: number;

    type_description: string;
    detailed_descriptions: string[];
    translated_vocabs: string[];
}

export type QuestionExplanation = Omit<Question, "options" | "correct_option_id">;

export interface Overview {
    id: number;
    question: string;
    is_starred: boolean;
    was_last_attempt_correct: boolean | null;
    last_answered_at: string | null;
}

export type OverviewFilters = "all" | "starred";
