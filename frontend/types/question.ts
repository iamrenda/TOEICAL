export interface Question {
    question_number: number;
    question: string;
    options: string[4];
    correct_option: number;
    translated_question: string;
    question_type_description: string;
    question_detailed_descriptions: string[];
    translated_option: string[];
    translated_vocab: string[];
}

export interface Overview {
    id: number;
    question: string;
    is_starred: boolean;
    was_last_attempt_correct: boolean | null;
    last_answered_at: string | null;
}
