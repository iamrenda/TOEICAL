import Variables from "@/constants/Variables";

enum Difficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
}

const difficultyColors: Record<Difficulty | string, { bg: string; text: string }> = {
    [Difficulty.EASY]: { bg: "#E6F4EA", text: "#1E8E3E" },
    [Difficulty.MEDIUM]: { bg: "#FEF7E0", text: "#E37400" },
    [Difficulty.HARD]: { bg: "#FCE8E6", text: "#D93025" },
    DEFAULT: { bg: Variables.gray100, text: Variables.gray600 },
};

/**
 * Returns background and text color based on difficulty level.
 * @param diff
 * @returns
 */
const getDifficultyColor = (text: Difficulty | string) => {
    return difficultyColors[text] || difficultyColors.DEFAULT;
};

export default getDifficultyColor;
