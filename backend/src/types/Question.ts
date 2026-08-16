interface Option {
    option: string;
    option_id: number;
    translated_option: string | null;
}

export interface Question {
    id: number;
    question: string;
    is_starred: boolean;
    correct_option_id: number;
    translated_question: string;
    type_description: string;
    options: Option[];
    detailed_description: string[];
    translated_vocabs: string[];
}
