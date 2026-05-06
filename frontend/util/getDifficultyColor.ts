import Variables from "@/constants/Variables";
import { WritingDifficulty } from "@/types/Writing";

const difficultyColors: Record<WritingDifficulty, { bg: string; text: string }> = {
    [WritingDifficulty.ALL]: { bg: Variables.gray100, text: Variables.gray600 },
    [WritingDifficulty.Easy]: { bg: "#E6F4EA", text: "#1E8E3E" },
    [WritingDifficulty.Medium]: { bg: "#FEF7E0", text: "#E37400" },
    [WritingDifficulty.Hard]: { bg: "#FCE8E6", text: "#D93025" },
};

/**
 * Returns background and text color based on difficulty level.
 * @param diff
 * @returns
 */
const getDifficultyColor = (text: WritingDifficulty) => {
    return difficultyColors[text];
};

export default getDifficultyColor;
